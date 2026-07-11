# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (http://localhost:5173)
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally

There is no lint or test tooling configured yet.

## Architecture

React + Vite SPA with Supabase for auth and data.

- `src/supabaseClient.js` — creates the Supabase client from `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` (set in `.env`, gitignored; see `.env.example` for the required keys).
- `src/context/AuthContext.jsx` — tracks the Supabase auth session app-wide via `onAuthStateChange`; exposes `user`, `loading`, `signOut`.
- `src/components/ProtectedRoute.jsx` — redirects to `/login` when there is no authenticated user.
- `src/App.jsx` — routes: `/login`, `/signup` (public), `/properties` (protected, all other paths redirect here).
- `src/pages/PropertyList.jsx` + `src/components/PropertyForm.jsx` — CRUD UI for the `properties` table (list/create/edit/delete), reusing one form component for both create and edit.
- `supabase/schema.sql` — defines the `properties` table (`user_id`, `name`, `rent`, `area`, `layout`) and RLS policies restricting select/insert/update/delete to rows where `auth.uid() = user_id`. Run manually in the Supabase SQL Editor — it is not applied automatically from this repo.

## Git Workflow

- **Push after every code change.** Whenever you modify code in this repository, commit the change and push it to GitHub immediately afterward — do not batch multiple unrelated changes into a single push, and do not leave committed work unpushed.
- Use clear, descriptive commit messages that explain the "why" behind the change.
- Confirm with the user before force-pushing, rewriting history, or pushing to protected branches (e.g. `main`).

## デプロイ情報

- 本番URL：https://realestate-app.vercel.app
- Supabaseプロジェクト名：realestate-app
