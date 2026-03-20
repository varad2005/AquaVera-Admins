import { pgTable, text, serial, integer, timestamp, real, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const requestStatusEnum = pgEnum("request_status", ["Pending", "Approved", "Rejected", "Flagged"]);
export const geoStatusEnum = pgEnum("geo_status", ["Valid", "Invalid", "Pending"]);
export const userStatusEnum = pgEnum("user_status", ["Active", "Inactive"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Using text IDs like USR-001
  name: text("name").notNull(),
  role: text("role").notNull(),
  status: userStatusEnum("status").notNull().default("Active"),
  lastLogin: timestamp("last_login").notNull().defaultNow(),
});

export const waterRequests = pgTable("water_requests", {
  id: text("id").primaryKey(), // Using text IDs like REQ-1001
  farmerName: text("farmer_name").notNull(),
  aadhaar: text("aadhaar").notNull(),
  landId: text("land_id").notNull(),
  village: text("village").notNull(),
  district: text("district").notNull(),
  cropType: text("crop_type").notNull(),
  durationHours: integer("duration_hours").notNull(),
  startDate: timestamp("start_date").notNull(),
  calculatedBilling: real("calculated_billing").notNull(),
  geoStatus: geoStatusEnum("geo_status").notNull().default("Pending"),
  status: requestStatusEnum("status").notNull().default("Pending"),
  confidenceScore: integer("confidence_score").notNull(),
  ndviIndex: real("ndvi_index").notNull(),
  assignedTo: text("assigned_to"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  user: text("user").notNull(),
  action: text("action").notNull(),
  ip: text("ip").notNull(),
  role: text("role").notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertRequestSchema = createInsertSchema(waterRequests);
export const selectRequestSchema = createSelectSchema(waterRequests);
export const insertLogSchema = createInsertSchema(auditLogs);
export const selectLogSchema = createSelectSchema(auditLogs);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type WaterRequest = typeof waterRequests.$inferSelect;
export type InsertRequest = typeof waterRequests.$inferInsert;
export type Log = typeof auditLogs.$inferSelect;
export type InsertLog = typeof auditLogs.$inferInsert;