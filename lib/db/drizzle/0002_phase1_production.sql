-- Phase 1 Migration: Production Architecture Upgrade
-- Additive, idempotent, non-destructive.
-- NO tables dropped. NO data deleted. NO schema reset.
--
-- Changes:
-- 1. Adds image metadata columns to water_requests (Supabase Storage)
-- 2. Creates bills table (normalized billing, future source of truth)
-- 3. Creates payments table (normalized payments, future source of truth)
-- 4. Adds performance indexes

-- ============================================================
-- 1. Image metadata columns on water_requests
-- ============================================================
-- These replace direct Base64 storage with Supabase Storage path references.
-- evidence_image (Base64) is preserved and deprecated for backward compatibility.
ALTER TABLE "water_requests"
  ADD COLUMN IF NOT EXISTS "evidence_image_path" text;

ALTER TABLE "water_requests"
  ADD COLUMN IF NOT EXISTS "evidence_image_mime" text;

ALTER TABLE "water_requests"
  ADD COLUMN IF NOT EXISTS "evidence_image_size" integer;

-- ============================================================
-- 2. Enums for bills and payments
-- ============================================================
DO $$ BEGIN
  CREATE TYPE "bill_status" AS ENUM ('Generated', 'Due', 'Paid', 'Cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "payment_status_enum" AS ENUM ('Pending', 'Completed', 'Failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 3. Create bills table (future source of truth for billing)
-- ============================================================
CREATE TABLE IF NOT EXISTS "bills" (
  "id"           serial PRIMARY KEY,
  "request_id"   text NOT NULL REFERENCES "water_requests"("id"),
  "user_id"      text NOT NULL REFERENCES "users"("id"),
  "amount"       real NOT NULL,
  "status"       bill_status NOT NULL DEFAULT 'Generated',
  "generated_at" timestamp NOT NULL DEFAULT now(),
  "due_date"     timestamp,
  "paid_at"      timestamp
);

-- ============================================================
-- 4. Create payments table (future source of truth for payments)
-- ============================================================
CREATE TABLE IF NOT EXISTS "payments" (
  "id"                      serial PRIMARY KEY,
  "bill_id"                 integer NOT NULL REFERENCES "bills"("id"),
  "user_id"                 text NOT NULL REFERENCES "users"("id"),
  "amount"                  real NOT NULL,
  "status"                  payment_status_enum NOT NULL DEFAULT 'Pending',
  "provider"                text,
  "provider_transaction_id" text,
  "created_at"              timestamp NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. Performance indexes (all created with IF NOT EXISTS pattern)
-- ============================================================
-- users: fast lookup by role (admin dashboards, farmer filtering)
CREATE INDEX IF NOT EXISTS "role_idx" ON "users"("role");

-- water_requests: IDOR ownership checks by user_id
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "water_requests"("user_id");

-- water_requests: status filter (Pending/Approved/Rejected dashboard views)
CREATE INDEX IF NOT EXISTS "status_idx" ON "water_requests"("status");

-- water_requests: legacy payment_status filter
CREATE INDEX IF NOT EXISTS "legacy_payment_status_idx" ON "water_requests"("payment_status");

-- water_requests: time-ordered listing
CREATE INDEX IF NOT EXISTS "req_timestamp_idx" ON "water_requests"("timestamp");

-- bills: fast lookup by request
CREATE INDEX IF NOT EXISTS "bill_request_id_idx" ON "bills"("request_id");

-- bills: fast lookup by farmer
CREATE INDEX IF NOT EXISTS "bill_user_id_idx" ON "bills"("user_id");

-- bills: status filter
CREATE INDEX IF NOT EXISTS "bill_status_idx" ON "bills"("status");

-- payments: fast lookup by bill
CREATE INDEX IF NOT EXISTS "payment_bill_id_idx" ON "payments"("bill_id");

-- payments: fast lookup by farmer
CREATE INDEX IF NOT EXISTS "payment_user_id_idx" ON "payments"("user_id");

-- audit_logs: time-ordered listing
CREATE INDEX IF NOT EXISTS "audit_timestamp_idx" ON "audit_logs"("timestamp");
