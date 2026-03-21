# AquaVera Project Structure

This document outlines the organization of the AquaVera monorepo, separating the frontend and backend components.

## Overall Architecture

The project is organized as a monorepo using **pnpm workspaces**. Shared logic and database schemas are maintained in the `lib` directory, while the application components reside in the `artifacts` directory.

---

## 🎨 Frontend (`/artifacts/aquavera-admin`)

The main administrative dashboard and farmer portal.

- **`src/pages`**: Main application screens (Dashboard, Requests, User Management, etc.)
    - **`src/pages/auth`**: Authentication flow (Login, SignUp, OTP, Forgot Password).
- **`src/components`**: Reusable UI components.
    - **`src/components/ui`**: Base UI elements (Buttons, Inputs, Cards, etc.) using Shadcn UI.
    - **`src/components/layout`**: Persistent layouts (AppLayout, AuthLayout).
- **`src/hooks`**: Custom React hooks for data fetching and state management.
- **`src/context`**: React Context providers (Role management, etc.).
- **`src/lib`**: Utility functions and configuration.
- **`index.html`**: Application entry point.
- **`vite.config.ts`**: Frontend build configuration.

---

## ⚙️ Backend (`/artifacts/api-server`)

The server-side API that powers the application.

- **`src/routes`**: API endpoints and route handlers.
- **`package.json`**: Backend dependencies and scripts.
- **`tsconfig.json`**: Backend-specific TypeSript configuration.
- **`build.ts`**: Deployment/build script for the server.

---

## 🗄️ Shared & Database (`/lib/db`)

Shared database logic and schemas used by both the frontend and backend.

- **`src/`**: Database schemas (Drizzle ORM) and migration scripts.
- **`drizzle.config.ts`**: ORM configuration.
- **`package.json`**: Database-related dependencies.

---

## 🛠️ Root Configuration

- **`pnpm-workspace.yaml`**: Defines the monorepo workspace boundaries.
- **`package.json`**: Root dependencies and workspace-wide scripts (`dev`, `build`, `typecheck`).
- **`tsconfig.base.json`**: Shared TypeScript configuration.
- **`.gitignore`**: Files and directories excluded from version control.
- **`.env`**: Local environment variables (not tracked in Git).
