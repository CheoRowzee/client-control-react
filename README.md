# LeadGenerator — Frontend

A React 18 + TypeScript + Vite frontend for the [LeadGenerator](../LeadGenerator) .NET 8 Web API.

**Stack:** React 18 · TypeScript · Vite · React Router 6 · Axios · plain CSS

---

## Features

- **Login / Register** with JWT — token stored in `localStorage`
- **Leads dashboard** — table with pagination, server-side paging via `page` + `pageSize`, client-side search on the current page by name or email
- **Create / Edit lead** — same form, reuses for both flows
- **Delete lead** — with confirmation
- **Layout** — sticky header, nav, logout, current user email
- **Protected routes** — anything under `/leads` redirects to `/login` when there's no token
- **Centralized Axios client** — JWT auto-attached, 401 → clear token + redirect to login
- **Env config** — `VITE_API_BASE_URL` picks the API base

## Project structure

```
src/
├── components/        Reusable UI pieces
│   └── Layout.tsx       Header + nav + logout, wraps every route
├── context/
│   └── AuthContext.tsx  Provider holding token + auth methods
├── hooks/
│   └── useAuth.ts       Tiny hook around AuthContext
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── LeadsPage.tsx        Table + search + pagination + delete
│   ├── LeadFormPage.tsx     Create + edit (one component, /new or /:id/edit)
│   └── NotFoundPage.tsx
├── routes/
│   └── ProtectedRoute.tsx   Auth guard
├── services/
│   ├── apiClient.ts     Axios instance + JWT + 401 interceptor
│   ├── authService.ts   /auth/login + /auth/register
│   └── leadsService.ts  /leads CRUD
├── types/
│   ├── auth.ts          Login/Register/Auth response types
│   └── lead.ts          Lead + PagedResult<T>
├── utils/
│   ├── errors.ts        extractErrorMessage(): unwraps ProblemDetails + Axios errors
│   └── token.ts         localStorage wrapper
├── App.tsx              Route table
├── main.tsx             Root: BrowserRouter > AuthProvider > App
└── index.css            All styling
```

---

## Prerequisites

- **Node.js 18+** (tested on 24.x)
- The LeadGenerator API running at `http://localhost:5000` (or wherever you configure)

## Setup

```bash
npm install
cp .env.example .env       # already created, edit if needed
npm run dev
```

App opens on `http://localhost:5173`. The API base URL comes from `.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Change it for any non-default backend (Docker host, deployed env, etc.).

## Scripts

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Vite dev server with HMR on port 5173         |
| `npm run build`   | Type-check (`tsc -b`) and production build    |
| `npm run preview` | Serve the production `dist/` locally          |
| `npm run lint`    | ESLint                                        |

---

## Auth flow

1. `LoginPage` / `RegisterPage` call `authService` which hits `/auth/login` or `/auth/register`.
2. On success, the JWT goes into `localStorage` (key: `leadgen.auth.token`) and `AuthContext` updates state.
3. Every subsequent request goes through the Axios interceptor in `services/apiClient.ts`, which attaches `Authorization: Bearer <token>`.
4. If the API returns **401**, the interceptor clears storage and redirects to `/login`. Manual logout (button in the header) does the same minus the redirect.
5. `ProtectedRoute` checks `isAuthenticated` from `AuthContext` and bounces unauthenticated users to `/login`, preserving the original location so they land back where they were after signing in.

## API contract assumed

The frontend expects the .NET API to return:

- `POST /auth/login` and `/auth/register` → `{ token, expiresAt, email }`
- `GET /leads?page=1&pageSize=10` → `{ items: Lead[], page, pageSize, totalItems, totalPages }`
- `GET /leads/{id}` → `Lead`
- `POST /leads` → `Lead` (201)
- `PUT /leads/{id}` → `Lead`
- `DELETE /leads/{id}` → 204

`Lead` shape: `{ id, name, email, phone?, source?, notes?, createdAt, updatedAt }`.

## Notes & deliberate choices

- **No Redux, no Zustand.** A single `AuthContext` is enough for this scope; component-local `useState` covers everything else.
- **No UI framework.** Plain CSS in `index.css`, ~250 lines. Tokens at the top of the file make it easy to re-theme.
- **Search is client-side on the current page.** The backend doesn't have a search filter yet — when it does, swap the `useMemo` in `LeadsPage.tsx` for a server-side query param.
- **One LeadFormPage for create + edit.** The presence of `:id` in the route decides the mode.
- **Errors are unwrapped** from RFC 7807 ProblemDetails (which the backend returns) by `utils/errors.ts`. Validation errors get joined into one message.

## Troubleshooting

- **CORS errors?** Make sure the .NET API allows `http://localhost:5173`. (The current backend doesn't add CORS yet — easiest fix in `Program.cs`: `builder.Services.AddCors(...)` + `app.UseCors(...)`.)
- **401 immediately after login?** Check that the JWT signing key matches between the token issuer and the validator on the API side.
- **Blank page in production build?** If you're hosting under a subpath, set `base: '/your-path/'` in `vite.config.ts`.
# client-control-react
