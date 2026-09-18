import http from "http";

async function runTests() {
  const baseUrl = "http://localhost:3000";
  let cookie = "";

  console.log("A. GET /api/auth/me without authentication");
  let res = await fetch(`${baseUrl}/api/auth/me`);
  console.log("Expected: 401, Got:", res.status);

  console.log("B. POST /api/login with invalid credentials");
  res = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@aquavera.com", password: "wrong" }),
  });
  console.log("Expected: 401, Got:", res.status);

  console.log("C. POST /api/login with valid credentials");
  res = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@aquavera.com", password: "password123" }),
  });
  console.log("Expected: 200, Got:", res.status);
  const setCookieHeader = res.headers.get("set-cookie");
  console.log("D. Verify response sets cookie:", setCookieHeader ? "PASS" : "FAIL");
  cookie = setCookieHeader ? setCookieHeader.split(";")[0] : "";

  console.log("E. GET /api/auth/me using the authenticated session");
  res = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Cookie: cookie },
  });
  console.log("Expected: 200, Got:", res.status);

  console.log("F. POST /api/logout");
  res = await fetch(`${baseUrl}/api/logout`, {
    method: "POST",
    headers: { Cookie: cookie },
  });
  console.log("Expected: 200, Got:", res.status);
  console.log("Logout cleared cookie:", res.headers.get("set-cookie")?.includes("token=;") ? "PASS" : "FAIL");

  console.log("G. GET /api/auth/me after logout");
  res = await fetch(`${baseUrl}/api/auth/me`);
  console.log("Expected: 401, Got:", res.status);
}

runTests().catch(console.error);
