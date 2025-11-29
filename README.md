## Kintar Backend (NestJS + MongoDB)

Production-ready NestJS API with MongoDB, JWT auth, Swagger docs, and a system user seeder for bootstrapping protected endpoints.

### Prerequisites
- Node.js 18+ recommended (works on 19.x as well)
- MongoDB instance/URI

### Setup
1. Copy `.env.example` to `.env` and fill values:
   - `MONGODB_URI` connection string
   - `JWT_SECRET` and `JWT_EXPIRES_IN`
   - `FRONTEND_APP_URL` (used to build invite links in notification emails)
   - `SYSTEM_ADMIN_NAME`, `SYSTEM_ADMIN_EMAIL`, `SYSTEM_ADMIN_PASSWORD` (for seeding)
   - `INVITE_EXPIRES_IN_HOURS` (default 72) and SMTP fields `EMAIL_HOST/PORT/USER/PASSWORD/FROM` if you want invites emailed
2. Install deps: `yarn install` (with Node 18/20+; on Node 19 use `yarn install --ignore-engines`)

### Run
- Dev server: `yarn start:dev` (listens on `PORT`, default 3000, global prefix `api`)
- Prod build/run: `yarn build` then `yarn start:prod`
- Swagger UI: `GET /api/docs`
- Health: `GET /api/health`

### Invitations + Onboarding (invite-only sign-up)
1. Seed system user (once): `yarn seed:system-user`
2. Authenticate as system user: `POST /api/auth/login`
3. Send invite (system role only): `POST /api/invitations` with `{ "email": "new.user@example.com" }`
   - If SMTP is configured, email is sent with a link to onboarding; otherwise token is logged/returned for manual sharing.
4. Accept invite and create account: `POST /api/invitations/accept` with `{ token, name, password }`
   - Frontend onboarding consumes `?invite=<token>` from the email link to finish sign-up.
5. Use returned `accessToken` (or login at `/api/auth/login`) to call protected endpoints like `GET /api/users/me` for dashboard gating.

### Auth Flow
1. Seed system user: `yarn seed:system-user` (uses SYSTEM_ADMIN_* env vars)
2. Login: `POST /api/auth/login` with `{ "email", "password" }` to receive `accessToken`
3. Call protected endpoints with `Authorization: Bearer <token>` (e.g., `GET /api/users/me`)

### Notes
- Validation is enforced globally (whitelist + transform).
- JWT strategy is configured via env; keep the secret strong.
- Mongoose schemas live under `src/users/schemas`; shared auth utilities under `src/common`.
- e2e tests expect the global prefix `/api`; provide a Mongo URI if you run them.
