import { db, users, waterRequests, auditLogs } from "../src";
import { subDays, subHours } from "date-fns";

async function seed() {
  console.log("Seeding database...");

  const now = new Date();

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
    { 
      id: "USR-004", 
      name: "Farmer Ravi", 
      email: "farmer@aquavera.com",
      phone: "9988776655",
      password: "password123",
      role: "Farmer", 
      status: "Active", 
      isProfileComplete: 0,
      lastLogin: subHours(now, 2) 
    },
    { 
      id: "USR-005", 
      name: "Ramesh Patel", 
      email: "ramesh@example.com",
      phone: "9876543214",
      password: "password123",
      role: "Farmer", 
      status: "Active", 
      aadhaar: "XXXX-XXXX-4592",
      landRecordId: "MH-7/12-84920",
      city: "Niphad",
      taluka: "Nashik",
      isProfileComplete: 1,
      lastLogin: subHours(now, 5) 
    },
    { 
      id: "USR-006", 
      name: "Sunil Kumar", 
      email: "sunil@example.com",
      phone: "9876543215",
      password: "password123",
      role: "Farmer", 
      status: "Active", 
      aadhaar: "XXXX-XXXX-1102",
      landRecordId: "MH-7/12-33211",
      city: "Baramati",
      taluka: "Pune",
      isProfileComplete: 1,
      lastLogin: subHours(now, 12) 
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
      cropType: "Sugarcane",
      durationHours: 12,
      startDate: subDays(now, 1),
      calculatedBilling: 1800,
      geoStatus: "Valid",
      status: "Approved",
      confidenceScore: 98,
      ndviIndex: 0.78,
      timestamp: subDays(now, 1),
      paymentStatus: "Paid"
    },
    {
      id: "REQ-1002",
      farmerName: "Ramesh Patel",
      aadhaar: "XXXX-XXXX-4592",
      landId: "MH-7/12-84920",
      village: "Niphad",
      district: "Nashik",
      cropType: "Sugarcane",
      durationHours: 8,
      startDate: subDays(now, 5),
      calculatedBilling: 1200,
      geoStatus: "Valid",
      status: "Approved",
      confidenceScore: 92,
      ndviIndex: 0.75,
      timestamp: subDays(now, 5),
      paymentStatus: "Paid"
    },
    {
      id: "REQ-1003",
      farmerName: "Ramesh Patel",
      aadhaar: "XXXX-XXXX-4592",
      landId: "MH-7/12-84920",
      village: "Niphad",
      district: "Nashik",
      cropType: "Wheat",
      durationHours: 16,
      startDate: subDays(now, 12),
      calculatedBilling: 2400,
      geoStatus: "Valid",
      status: "Approved",
      confidenceScore: 95,
      ndviIndex: 0.82,
      timestamp: subDays(now, 12),
      paymentStatus: "Paid"
    },
    {
      id: "REQ-1004",
      farmerName: "Ramesh Patel",
      aadhaar: "XXXX-XXXX-4592",
      landId: "MH-7/12-84920",
      village: "Niphad",
      district: "Nashik",
      cropType: "Sugarcane",
      durationHours: 24,
      startDate: now,
      calculatedBilling: 3600,
      geoStatus: "Pending",
      status: "Pending",
      confidenceScore: 88,
      ndviIndex: 0.65,
      timestamp: now,
      paymentStatus: "Unpaid"
    },
    {
      id: "REQ-1005",
      farmerName: "Sunil Kumar",
      aadhaar: "XXXX-XXXX-1102",
      landId: "MH-7/12-33211",
      village: "Baramati",
      district: "Pune",
      cropType: "Cotton",
      durationHours: 24,
      startDate: subDays(now, 2),
      calculatedBilling: 2900,
      geoStatus: "Invalid",
      status: "Flagged",
      confidenceScore: 45,
      ndviIndex: 0.31,
      timestamp: subHours(now, 12),
      paymentStatus: "Unpaid"
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
