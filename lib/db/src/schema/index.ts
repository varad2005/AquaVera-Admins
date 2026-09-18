import { pgTable, text, serial, integer, timestamp, real, pgEnum, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const requestStatusEnum = pgEnum("request_status", ["Pending", "Approved", "Rejected", "Flagged"]);
export const geoStatusEnum = pgEnum("geo_status", ["Valid", "Invalid", "Pending"]);
export const userStatusEnum = pgEnum("user_status", ["Active", "Inactive"]);
export const billStatusEnum = pgEnum("bill_status", ["Generated", "Due", "Paid", "Cancelled"]);
export const paymentStatusEnum = pgEnum("payment_status_enum", ["Pending", "Completed", "Failed"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Using text IDs like USR-001
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  password: text("password").notNull(),
  role: text("role").notNull(),
  status: userStatusEnum("status").notNull().default("Active"),
  lastLogin: timestamp("last_login").notNull().defaultNow(),
  
  // Farmer specific fields (optional until profile completion)
  aadhaar: text("aadhaar"),
  landRecordId: text("land_record_id"), // 7/12 number
  plotNumber: text("plot_number"),
  state: text("state"),
  city: text("city"),
  taluka: text("taluka"),
  pinCode: text("pin_code"),
  surveyNumber: text("survey_number"),
  isProfileComplete: integer("is_profile_complete").notNull().default(0), // 0 for false, 1 for true
}, (table) => {
  return {
    roleIdx: index("role_idx").on(table.role),
  };
});

export const waterRequests = pgTable("water_requests", {
  id: text("id").primaryKey(), // Using text IDs like REQ-1001
  userId: text("user_id").references(() => users.id), // Added for IDOR protection
  farmerName: text("farmer_name").notNull(),
  aadhaar: text("aadhaar").notNull(),
  landId: text("land_id").notNull(),
  village: text("village").notNull(),
  district: text("district").notNull(),
  cropType: text("crop_type").notNull(),
  durationHours: integer("duration_hours").notNull(),
  startDate: timestamp("start_date").notNull(),
  
  // Legacy / Deprecated fields for Phase 0 compatibility
  calculatedBilling: real("calculated_billing").notNull(),
  paymentStatus: text("payment_status").notNull().default("Unpaid"),

  geoStatus: geoStatusEnum("geo_status").notNull().default("Pending"),
  status: requestStatusEnum("status").notNull().default("Pending"),
  confidenceScore: integer("confidence_score").notNull(),
  ndviIndex: real("ndvi_index").notNull(),
  assignedTo: text("assigned_to"),
  
  evidenceImage: text("evidence_image"), // Legacy Base64 or URL
  evidenceImagePath: text("evidence_image_path"), // Supabase storage path
  evidenceImageMime: text("evidence_image_mime"), // MIME type
  evidenceImageSize: integer("evidence_image_size"), // Size in bytes
  
  latitude: real("latitude"),
  longitude: real("longitude"),
  deviceInfo: text("device_info"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
}, (table) => {
  return {
    userIdIdx: index("user_id_idx").on(table.userId),
    statusIdx: index("status_idx").on(table.status),
    paymentStatusIdx: index("legacy_payment_status_idx").on(table.paymentStatus),
    timestampIdx: index("req_timestamp_idx").on(table.timestamp),
  };
});

export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  requestId: text("request_id").references(() => waterRequests.id).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  amount: real("amount").notNull(),
  status: billStatusEnum("status").notNull().default("Generated"),
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
}, (table) => {
  return {
    requestIdIdx: index("bill_request_id_idx").on(table.requestId),
    userIdIdx: index("bill_user_id_idx").on(table.userId),
    statusIdx: index("bill_status_idx").on(table.status),
  };
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  billId: integer("bill_id").references(() => bills.id).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  amount: real("amount").notNull(),
  status: paymentStatusEnum("status").notNull().default("Pending"),
  provider: text("provider"), // e.g. "Mock", "Razorpay"
  providerTransactionId: text("provider_transaction_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    billIdIdx: index("payment_bill_id_idx").on(table.billId),
    userIdIdx: index("payment_user_id_idx").on(table.userId),
  };
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  user: text("user").notNull(),
  action: text("action").notNull(),
  ip: text("ip").notNull(),
  role: text("role").notNull(),
}, (table) => {
  return {
    timestampIdx: index("audit_timestamp_idx").on(table.timestamp),
  };
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertRequestSchema = createInsertSchema(waterRequests);
export const selectRequestSchema = createSelectSchema(waterRequests);
export const insertLogSchema = createInsertSchema(auditLogs);
export const selectLogSchema = createSelectSchema(auditLogs);
export const insertBillSchema = createInsertSchema(bills);
export const selectBillSchema = createSelectSchema(bills);
export const insertPaymentSchema = createInsertSchema(payments);
export const selectPaymentSchema = createSelectSchema(payments);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type WaterRequest = typeof waterRequests.$inferSelect;
export type InsertRequest = typeof waterRequests.$inferInsert;
export type Log = typeof auditLogs.$inferSelect;
export type InsertLog = typeof auditLogs.$inferInsert;
export type Bill = typeof bills.$inferSelect;
export type InsertBill = typeof bills.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
