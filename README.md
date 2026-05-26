<div align="center">

# 💧 AquaVera

### Smart Irrigation Management System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=supabase&logoColor=white)](https://supabase.com/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**An intelligent, role-based platform for managing agricultural water requests, billing, and distribution — built for government irrigation departments and farmers.**

[Features](#-features) · [Screenshots](#-screenshots) · [Getting Started](#-getting-started) · [API Docs](#-api-reference) · [Architecture](#-architecture)

</div>

---

## 📖 About

**AquaVera** digitizes the agricultural water supply management process. It bridges the gap between government irrigation departments and farmers by providing:

- 🧑‍🌾 A **Farmer Portal** — register, submit water requests, track approvals, view satellite-verified billing, and pay online.
- 🛡️ An **Admin Dashboard** — manage users, review geo-verified requests (NDVI, confidence scores), approve/reject, and audit activity.
- 🌍 **Satellite Integration** — 7/12 land record verification, NDVI vegetation indexing, and geo-coordinate validation.
- 🌐 **Multi-language Support** — full internationalization for regional accessibility.

---

## 📸 Screenshots

<div align="center">

### Landing Page — Hero Section
<img src="docs/screenshots/landing-hero.png" alt="AquaVera Landing Page" width="800" />

### Land Verification & Feature Overview
<img src="docs/screenshots/landing-features.png" alt="Features Section" width="800" />

### Transparent Billing System
<img src="docs/screenshots/landing-billing.png" alt="Billing Section" width="800" />

### Login Portal
<img src="docs/screenshots/login-page.png" alt="Login Page" width="800" />

</div>

---

## ✨ Features

### 👨‍🌾 Farmer Portal

- **Secure Authentication** — Sign up with OTP verification, login, password recovery
- **Profile Completion** — Aadhaar, 7/12 land record, plot & survey number, location
- **Submit Water Requests** — Specify crop type, irrigation duration, and upload geo-verified evidence (camera capture with GPS)
- **Track Requests** — Real-time status tracking: `Pending` → `Approved` → `Completed`
- **View Bills & Pay Online** — Satellite-verified water usage with transparent billing
- **Land Summary** — View all registered land details and survey information

### 🛡️ Admin & Sub-Admin Dashboard

- **Analytics Overview** — Total requests, approval rates, system health at a glance
- **Request Management** — Review, approve, reject, or flag requests with full details
- **Deep Request Inspection** — Geo-status, NDVI index, confidence score, evidence images, device info
- **Survey Map** — Interactive Leaflet-based geographic map of land parcels and request locations
- **User Management** — Create, edit, activate/deactivate Admin, Sub-Admin, and Farmer accounts
- **Registered Farmers** — Browse and manage all farmer profiles
- **Activity Logs** — Full audit trail with timestamps, user, action, IP address, and role
- **Settings** — Application and account configuration

### 🌐 Landing Page

- Premium animated UI with Framer Motion
- Feature showcase with satellite verification demo
- Live billing transparency preview with Recharts
- Farmer testimonials, FAQs (accordion), and contact form

---

## 🛠 Tech Stack

<table>
<tr>
<td valign="top" width="33%">

### Frontend
- React 19
- Vite 7
- TypeScript 5.9
- Tailwind CSS 4
- Shadcn UI / Radix
- Wouter (routing)
- TanStack React Query
- Framer Motion
- Recharts
- Leaflet (maps)
- Zod (validation)

</td>
<td valign="top" width="33%">

### Backend
- Express 5
- Node.js
- tsx (dev runner)
- esbuild (prod build)
- Pino (structured logging)
- CORS
- dotenv

</td>
<td valign="top" width="33%">

### Database & Shared
- PostgreSQL (Supabase)
- Drizzle ORM
- Drizzle Kit (migrations)
- Drizzle-Zod
- OpenAPI Spec
- Auto-gen React Query hooks

</td>
</tr>
</table>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **pnpm** v10 or higher — `npm install -g pnpm`
- **PostgreSQL** database — [Supabase](https://supabase.com/) (recommended, free tier available)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/varad2005/AquaVera-Admins.git
cd AquaVera-Admins

# 2. Install all dependencies (frontend + backend + shared libs)
pnpm install

# 3. Set up environment variables
cp .env.example .env   # or create manually (see below)
```

### Environment Setup

Create a `.env` file in the **project root**:

```env
DATABASE_URL=postgresql://postgres.[your-project-ref]:[your-password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

<details>
<summary>🔑 <strong>How to get your Supabase connection string</strong></summary>
<br/>

1. Go to [supabase.com](https://supabase.com/) → open your project
2. Navigate to **Project Settings** → **Database**
3. Under **Connection string**, select the **URI** tab
4. Copy the string and replace `[YOUR-PASSWORD]` with your actual password
5. Paste into `.env`

</details>

### Database Setup

```bash
# Push schema to database (first time)
cd lib/db
npx drizzle-kit push
cd ../..

# (Optional) Seed with sample data
cd lib/db
npx tsx src/seed.ts
cd ../..
```

### Run Development Servers

```bash
pnpm run dev
```

| Service | URL |
|---|---|
| 🎨 Frontend | http://localhost:5173 |
| ⚙️ Backend API | http://localhost:3000 |

---

## 📡 API Reference

Base URL: `/api`

### Health Check
```
GET /api/health
```

### Water Requests
```
GET    /api/requests          # List all requests
GET    /api/requests/:id      # Get single request
POST   /api/requests          # Create new request
PATCH  /api/requests/:id      # Update status (Approve/Reject/Flag)
PATCH  /api/requests/:id/pay  # Mark as paid
POST   /api/requests/pay-all  # Bulk pay for a farmer
```

### Users
```
GET    /api/users             # List all users
POST   /api/users             # Create user
PATCH  /api/users/:id         # Update user
DELETE /api/users/:id         # Delete user
```

### Farmers & Logs
```
GET    /api/farmers            # List registered farmers
GET    /api/logs               # List audit logs
```

---

## 🏗 Architecture

```
AquaVera-Admins/                         # pnpm monorepo
│
├── artifacts/
│   ├── aquavera-admin/                  # 🎨 Frontend (React + Vite)
│   │   └── src/
│   │       ├── pages/
│   │       │   ├── auth/               # Login, SignUp, OTP, Forgot Password
│   │       │   ├── farmer/             # New Request, Bills, Land, Payment
│   │       │   ├── dashboard.tsx       # Admin Dashboard
│   │       │   ├── farmer-dashboard.tsx
│   │       │   ├── water-requests.tsx
│   │       │   ├── survey-map.tsx      # Leaflet interactive map
│   │       │   ├── user-management.tsx
│   │       │   ├── activity-logs.tsx
│   │       │   └── settings.tsx
│   │       ├── components/
│   │       │   ├── ui/                 # Shadcn primitives
│   │       │   ├── ui-custom/          # StatCard, StatusBadge, CameraCapture
│   │       │   └── layout/            # Sidebar, Header, Footer, Layouts
│   │       ├── context/               # RoleContext, LanguageContext (i18n)
│   │       └── hooks/                 # useMobile, useMockApi, useToast
│   │
│   └── api-server/                     # ⚙️ Backend (Express 5)
│       └── src/
│           ├── routes/
│           │   ├── requests.ts        # Water request CRUD + payments
│           │   ├── users.ts           # User management
│           │   ├── farmers.ts         # Farmer queries
│           │   ├── logs.ts            # Audit logs
│           │   └── health.ts          # Health check
│           ├── middlewares/
│           └── lib/                   # Pino logger
│
├── lib/
│   ├── db/                             # 🗄️ Database Layer
│   │   └── src/
│   │       ├── schema/index.ts        # Drizzle table definitions
│   │       ├── seed.ts                # Database seeder
│   │       └── migrate.ts            # Migration runner
│   ├── api-spec/                      # OpenAPI spec
│   ├── api-zod/                       # Shared Zod schemas
│   └── api-client-react/              # Generated React Query hooks
│
├── .env                               # Environment variables (git-ignored)
├── pnpm-workspace.yaml                # Monorepo workspace config
├── tsconfig.base.json                 # Shared TS config
└── package.json                       # Root scripts
```

### Data Flow

```
┌────────────────────┐     HTTP/REST      ┌─────────────────────┐     Drizzle ORM     ┌──────────────┐
│   React Frontend   │ ◄──────────────► │   Express API       │ ◄────────────────► │  PostgreSQL  │
│   (Vite, port 5173)│                   │   (Node, port 3000) │                    │  (Supabase)  │
└────────────────────┘                   └─────────────────────┘                    └──────────────┘
```

---

## 🗄 Database Schema

Three core tables defined with [Drizzle ORM](https://orm.drizzle.team/):

### `users`
Stores all user accounts — Admins, Sub-Admins, and Farmers.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (PK) | e.g. `USR-001` |
| `name`, `email`, `phone` | TEXT | Basic info (`email` is unique) |
| `password` | TEXT | Hashed |
| `role` | TEXT | `Admin` / `Sub-Admin` / `Farmer` |
| `status` | ENUM | `Active` / `Inactive` |
| `aadhaar`, `land_record_id`, `survey_number` | TEXT | Farmer-specific (nullable) |
| `is_profile_complete` | INT | `0` or `1` |

### `water_requests`
Tracks every irrigation request from submission to payment.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (PK) | e.g. `REQ-1001` |
| `farmer_name`, `aadhaar`, `land_id` | TEXT | Farmer identity |
| `village`, `district`, `crop_type` | TEXT | Location & crop |
| `duration_hours` | INT | Requested hours |
| `calculated_billing` | REAL | Auto-calculated ₹ amount |
| `status` | ENUM | `Pending` / `Approved` / `Rejected` / `Flagged` |
| `geo_status` | ENUM | `Valid` / `Invalid` / `Pending` |
| `confidence_score` | INT | AI score (0–100) |
| `ndvi_index` | REAL | Satellite vegetation index |
| `latitude`, `longitude` | REAL | GPS coordinates |
| `payment_status` | TEXT | `Paid` / `Unpaid` |

### `audit_logs`
Immutable record of every admin action.

| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL (PK) | Auto-increment |
| `timestamp` | TIMESTAMP | When the action occurred |
| `user` | TEXT | Who did it |
| `action` | TEXT | What they did |
| `ip` | TEXT | From where |
| `role` | TEXT | Their role |

---

## 📜 Scripts

| Command | Description |
|---|---|
| `pnpm run dev` | Start frontend + backend dev servers in parallel |
| `pnpm run build` | Typecheck & production build |
| `pnpm run typecheck` | TypeScript checks across all packages |

---

## 🔒 Security

- **Supply-chain attack defense** — `pnpm-workspace.yaml` enforces 1-day minimum release age for all npm packages
- **Secrets management** — `.env` is git-ignored; no credentials in source control
- **Role-based access** — Route guards with `Admin` / `Sub-Admin` / `Farmer` role context
- **Input validation** — Zod schemas on both client and server

---

## 🤝 Contributing

```bash
# Fork the repo, then:
git checkout -b feature/amazing-feature
git commit -m "Add amazing feature"
git push origin feature/amazing-feature
# Open a Pull Request
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

**Built with ❤️ by [Varad](https://github.com/varad2005)**

*AquaVera — Empowering farmers through smart, transparent water management* 💧

</div>
