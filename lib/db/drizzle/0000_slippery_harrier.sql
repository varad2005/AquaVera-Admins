CREATE TYPE "public"."geo_status" AS ENUM('Valid', 'Invalid', 'Pending');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('Pending', 'Approved', 'Rejected', 'Flagged');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('Active', 'Inactive');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"user" text NOT NULL,
	"action" text NOT NULL,
	"ip" text NOT NULL,
	"role" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "farmers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"aadhaar" text NOT NULL,
	"land_id" text NOT NULL,
	"village" text NOT NULL,
	"district" text NOT NULL,
	"total_requests" integer DEFAULT 0 NOT NULL,
	"active_connections" integer DEFAULT 0 NOT NULL,
	"last_connection" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"password" text NOT NULL,
	"role" text NOT NULL,
	"status" "user_status" DEFAULT 'Active' NOT NULL,
	"last_login" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "water_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"farmer_name" text NOT NULL,
	"aadhaar" text NOT NULL,
	"land_id" text NOT NULL,
	"village" text NOT NULL,
	"district" text NOT NULL,
	"crop_type" text NOT NULL,
	"duration_hours" integer NOT NULL,
	"start_date" timestamp NOT NULL,
	"calculated_billing" real NOT NULL,
	"geo_status" "geo_status" DEFAULT 'Pending' NOT NULL,
	"status" "request_status" DEFAULT 'Pending' NOT NULL,
	"confidence_score" integer NOT NULL,
	"ndvi_index" real NOT NULL,
	"assigned_to" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
