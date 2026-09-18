-- Phase 0 Security Migration: Add user_id to water_requests table
-- This adds IDOR protection ownership tracking.
-- Column is NULLABLE to preserve existing historical requests without breaking them.
-- A separate, safe backfill script (using aadhaar matching only) should be run manually.

ALTER TABLE "water_requests" 
  ADD COLUMN IF NOT EXISTS "user_id" text REFERENCES "users"("id");

-- Also add missing columns that exist in schema but not in original migration
ALTER TABLE "water_requests"
  ADD COLUMN IF NOT EXISTS "evidence_image" text;

ALTER TABLE "water_requests"
  ADD COLUMN IF NOT EXISTS "latitude" real;

ALTER TABLE "water_requests"
  ADD COLUMN IF NOT EXISTS "longitude" real;

ALTER TABLE "water_requests"
  ADD COLUMN IF NOT EXISTS "device_info" text;

ALTER TABLE "water_requests"
  ADD COLUMN IF NOT EXISTS "payment_status" text NOT NULL DEFAULT 'Unpaid';

-- Also add farmer-specific columns to users table if not already present
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "aadhaar" text;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "land_record_id" text;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "plot_number" text;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "state" text;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "city" text;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "taluka" text;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "pin_code" text;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "survey_number" text;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "is_profile_complete" integer NOT NULL DEFAULT 0;
