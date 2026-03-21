import { db, users, waterRequests, auditLogs, farmers } from "../src";
import { subDays, subHours } from "date-fns";

async function seed() {
  console.log("Seeding database...");

  const now = new Date();

  // Seed Farmers
  await db.insert(farmers).values([
    { 
      id: "FRM-84920", 
      name: "Ramesh Patel", 
      aadhaar: "XXXX-XXXX-4592", 
      landId: "MH-7/12-84920", 
      village: "Niphad", 
      district: "Nashik",
      totalRequests: 1,
      activeConnections: 0,
      lastConnection: subHours(now, 5)
    },
    { 
      id: "FRM-33211", 
      name: "Sunil Kumar", 
      aadhaar: "XXXX-XXXX-1102", 
      landId: "MH-7/12-33211", 
      village: "Baramati", 
      district: "Pune",
      totalRequests: 1,
      activeConnections: 0,
      lastConnection: subHours(now, 12)
    },
  ]).onConflictDoNothing();

  // Seed Users
  await db.insert(users).values([
    { 
      id: "USR-001", 
      name: "Admin User 1", 
      email: "admin1@aquavera.com",
      phone: "9876543210",
      password: "password123",
      role: "Admin", 
      status: "Active", 
      lastLogin: subHours(now, 1) 
    },
    { 
      id: "USR-002", 
      name: "Sub-Admin North", 
      email: "north@aquavera.com",
      phone: "9876543211",
      password: "password123",
      role: "Sub-Admin", 
      status: "Active", 
      lastLogin: subHours(now, 4) 
    },
    { 
      id: "USR-003", 
      name: "Sub-Admin South", 
      email: "south@aquavera.com",
      phone: "9876543212",
      password: "password123",
      role: "Sub-Admin", 
      status: "Inactive", 
      lastLogin: subDays(now, 5) 
    },
  ]).onConflictDoNothing();

  // Seed Water Requests
  await db.insert(waterRequests).values([
    {
      id: "REQ-1001",
      farmerName: "Ramesh Patel",
      aadhaar: "XXXX-XXXX-4592",
      landId: "MH-7/12-84920",
      village: "Niphad",
      district: "Nashik",
      cropType: "Wheat",
      durationHours: 12,
      startDate: subDays(now, 1),
      calculatedBilling: 1450,
      geoStatus: "Valid",
      status: "Pending",
      confidenceScore: 94,
      ndviIndex: 0.72,
      timestamp: subHours(now, 5),
    },
    {
      id: "REQ-1002",
      farmerName: "Sunil Kumar",
      aadhaar: "XXXX-XXXX-1102",
      landId: "MH-7/12-33211",
      village: "Baramati",
      district: "Pune",
      cropType: "Sugarcane",
      durationHours: 24,
      startDate: subDays(now, 0),
      calculatedBilling: 2900,
      geoStatus: "Invalid",
      status: "Flagged",
      confidenceScore: 45,
      ndviIndex: 0.31,
      timestamp: subHours(now, 12),
    },
  ]).onConflictDoNothing();

  // Seed Audit Logs
  await db.insert(auditLogs).values([
    { timestamp: subHours(now, 1), user: "Admin User 1", action: "Approved Request #REQ-1003", ip: "192.168.1.45", role: "Admin" },
    { timestamp: subHours(now, 2), user: "System", action: "Auto-flagged Request #REQ-1002 (Low Confidence)", ip: "127.0.0.1", role: "System" },
  ]);

  console.log("Seeding complete!");
}

seed().catch(console.error);
