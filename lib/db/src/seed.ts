import { db, users, waterRequests, auditLogs, WaterRequest, User } from "../src";
import { subDays, subHours } from "date-fns";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🚀 Starting database reset and seeding...");

  try {
    // 1. CLEAR EXISTING DATA (Maintain referential integrity by order)
    console.log("🧹 Cleaning up old test data...");
    await db.delete(auditLogs);
    await db.delete(waterRequests);
    await db.delete(users);

    const now = new Date();

    // 2. DEFINE 20 DIVERSE ENTRIES
    console.log("🌱 Inserting 20 entries...");

    // 2.1 USERS (1 Admin, 2 Sub-Admins, 17 Farmers)
    const userData = [
      { id: "A-001", name: "System Admin", email: "admin@aquavera.com", phone: "9810010001", role: "Admin", status: "Active" },
      { id: "S-001", name: "Division Head North", email: "north@aquavera.com", phone: "9810010002", role: "Sub-Admin", status: "Active" },
      { id: "S-002", name: "Regional Inspector West", email: "west@aquavera.com", phone: "9810010003", role: "Sub-Admin", status: "Active" },
      { id: "F-001", name: "Rajesh Deshmukh", email: "rajesh@farmer.com", phone: "9910101001", role: "Farmer", city: "Manchar", taluka: "Pune", status: "Active", isProfileComplete: 1 },
      { id: "F-002", name: "Amit Patil", email: "amit@farmer.com", phone: "9910101002", role: "Farmer", city: "Tasgaon", taluka: "Sangli", status: "Active", isProfileComplete: 1 },
      { id: "F-003", name: "Suresh Kulkarni", email: "suresh@farmer.com", phone: "9910101003", role: "Farmer", city: "Niphad", taluka: "Nashik", status: "Active", isProfileComplete: 1 },
      { id: "F-004", name: "Vijay Pawar", email: "vijay@farmer.com", phone: "9910101004", role: "Farmer", city: "Malegaon", taluka: "Baramati", status: "Active", isProfileComplete: 1 },
      { id: "F-005", name: "Sunil More", email: "sunil@farmer.com", phone: "9910101005", role: "Farmer", city: "Raver", taluka: "Jalgaon", status: "Active", isProfileComplete: 1 },
      { id: "F-006", name: "Prakash Shinde", email: "prakash@farmer.com", phone: "9910101006", role: "Farmer", city: "Karad", taluka: "Satara", status: "Active", isProfileComplete: 1 },
      { id: "F-007", name: "Anil Gaikwad", email: "anil@farmer.com", phone: "9910101007", role: "Farmer", city: "Pandharpur", taluka: "Solapur", status: "Active", isProfileComplete: 1 },
      { id: "F-008", name: "Deepak Jadhav", email: "deepak@farmer.com", phone: "9910101008", role: "Farmer", city: "Katol", taluka: "Nagpur", status: "Active", isProfileComplete: 1 },
      { id: "F-009", name: "Sanjay Bhosale", email: "sanjay@farmer.com", phone: "9910101009", role: "Farmer", city: "Alibag", taluka: "Raigad", status: "Active", isProfileComplete: 1 },
      { id: "F-010", name: "Ashok Chavan", email: "ashok@farmer.com", phone: "9910101010", role: "Farmer", city: "Gangapur", taluka: "Aurangabad", status: "Active", isProfileComplete: 1 },
      { id: "F-011", name: "Ganesh Gavit", email: "ganesh@farmer.com", phone: "9910101011", role: "Farmer", city: "Shahada", taluka: "Nandurbar", status: "Active", isProfileComplete: 1 },
      { id: "F-012", name: "Manoj Tambe", email: "manoj@farmer.com", phone: "9910101012", role: "Farmer", city: "Lanja", taluka: "Ratnagiri", status: "Active", isProfileComplete: 1 },
      { id: "F-013", name: "Rahul Deshpande", email: "rahul@farmer.com", phone: "9910101013", role: "Farmer", city: "Udgir", taluka: "Latur", status: "Active", isProfileComplete: 1 },
      { id: "F-014", name: "Vinayak Mohite", email: "vinayak@farmer.com", phone: "9910101014", role: "Farmer", city: "Kagal", taluka: "Kolhapur", status: "Active", isProfileComplete: 1 },
      { id: "F-015", name: "Santosh Nikam", email: "santosh@farmer.com", phone: "9910101015", role: "Farmer", city: "Patur", taluka: "Akola", status: "Active", isProfileComplete: 1 },
      { id: "F-016", name: "Nitin Dalvi", email: "nitin@farmer.com", phone: "9910101016", role: "Farmer", city: "Vengurla", taluka: "Sindhudurg", status: "Active", isProfileComplete: 1 },
      { id: "F-017", name: "Sachin Kale", email: "sachin@farmer.com", phone: "9910101017", role: "Farmer", city: "Georai", taluka: "Beed", status: "Active", isProfileComplete: 1 },
    ];

    const usersToInsert = userData.map(u => ({
      ...u,
      password: "password123",
      aadhaar: u.role === "Farmer" ? `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}` : null,
      landRecordId: u.role === "Farmer" ? `MH-7/12-${Math.floor(10000 + Math.random() * 89999)}` : null,
      lastLogin: subHours(now, Math.floor(Math.random() * 24)),
      status: u.status as "Active" | "Inactive"
    }));

    await db.insert(users).values(usersToInsert as any);

    // 2.2 WATER REQUESTS (One for each farmer - 17 requests)
    const farmers = userData.filter(u => u.role === "Farmer");
    const crops = ["Sugarcane", "Grapes", "Onion", "Cotton", "Wheat", "Rice", "Pomegranate", "Orange"];
    
    const requestData = farmers.map((f, i) => ({
      id: `REQ-${1000 + i}`,
      farmerName: f.name,
      aadhaar: `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
      landId: `MH-7/12-${Math.floor(10000 + Math.random() * 89999)}`,
      village: f.city || "Unknown",
      district: f.taluka || "Unknown",
      cropType: crops[i % crops.length],
      durationHours: 8 + (i % 16),
      startDate: subDays(now, i % 5),
      calculatedBilling: (8 + (i % 16)) * 150,
      geoStatus: (i % 10 === 0 ? "Invalid" : "Valid") as "Valid" | "Invalid" | "Pending",
      status: (i % 10 === 0 ? "Pending" : "Approved") as "Pending" | "Approved" | "Rejected" | "Flagged",
      confidenceScore: 70 + Math.floor(Math.random() * 29),
      ndviIndex: 0.4 + (Math.random() * 0.5),
      timestamp: subDays(now, i % 10),
      paymentStatus: i % 2 === 0 ? "Paid" : "Unpaid"
    }));

    await db.insert(waterRequests).values(requestData as any);

    // 2.3 AUDIT LOGS
    const logData = [
      { timestamp: subHours(now, 1), user: "System Admin", action: "System Health Check - ALL OK", ip: "192.168.1.1", role: "Admin" },
      { timestamp: subHours(now, 5), user: "Division Head North", action: "Approved Bulk Payouts", ip: "10.0.0.5", role: "Sub-Admin" },
      { timestamp: subHours(now, 12), user: "System", action: "Executed Daily DB Backup", ip: "127.0.0.1", role: "System" },
    ];

    await db.insert(auditLogs).values(logData);

    console.log("✅ Seeding complete! 20 clean entries added.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
