import http from "http";

async function runAuthzTests() {
  const baseUrl = "http://localhost:3000";
  
  // 1. Farmer Login
  let res = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "rajesh@farmer.com", password: "password123" }),
  });
  const farmerCookie = res.headers.get("set-cookie")?.split(";")[0] || "";
  const farmerData = await res.json();
  const farmerId = farmerData.id;

  // 2. Farmer access own profile (PATCH)
  res = await fetch(`${baseUrl}/api/users/profile/${farmerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: farmerCookie },
    body: JSON.stringify({ city: "Pune" })
  });
  console.log("Farmer access own profile:", res.status === 200 ? "PASS" : "FAIL");

  // 3. Farmer access another farmer's profile (F-002)
  res = await fetch(`${baseUrl}/api/users/profile/F-002`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: farmerCookie },
    body: JSON.stringify({ city: "Pune" })
  });
  console.log("Farmer cannot access another profile:", res.status === 403 ? "PASS" : "FAIL (" + res.status + ")");

  // 4. Farmer access admin endpoints (/api/users)
  res = await fetch(`${baseUrl}/api/users`, {
    headers: { Cookie: farmerCookie },
  });
  console.log("Farmer cannot access admin users endpoint:", res.status === 403 ? "PASS" : "FAIL");

  // 5. Farmer access logs
  res = await fetch(`${baseUrl}/api/logs`, {
    headers: { Cookie: farmerCookie },
  });
  console.log("Farmer cannot access admin logs endpoint:", res.status === 403 ? "PASS" : "FAIL (" + res.status + ")");

  // 6. Admin login
  res = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@aquavera.com", password: "password123" }),
  });
  const adminCookie = res.headers.get("set-cookie")?.split(";")[0] || "";

  // 7. Admin access users endpoint
  res = await fetch(`${baseUrl}/api/users`, {
    headers: { Cookie: adminCookie },
  });
  console.log("Admin can access users endpoint:", res.status === 200 ? "PASS" : "FAIL");
}

runAuthzTests().catch(console.error);
