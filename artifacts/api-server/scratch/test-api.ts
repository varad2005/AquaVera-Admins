async function runTests() {
  console.log("=== API VERIFICATION ===");

  async function testFarmer(email: string, expectedRequests: number) {
    console.log(`\nTesting ${email}...`);
    
    // 1. Login
    const loginRes = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: "password123" })
    });
    const authHeader = loginRes.headers.get("set-cookie");
    
    if (!loginRes.ok) {
      console.log(`❌ Login failed for ${email}`);
      return;
    }
    
    // 2. Fetch requests
    const reqsRes = await fetch("http://localhost:3000/api/requests", {
      headers: { "Cookie": authHeader || "" }
    });
    
    const reqsData = await reqsRes.json();
    console.log(`Requests returned: ${reqsData.data.length} (Expected: ${expectedRequests})`);
    if (reqsData.data.length === expectedRequests) {
      console.log(`✅ Success for ${email}`);
    } else {
      console.log(`❌ Failed for ${email}`);
    }
  }

  await testFarmer("vinayak@farmer.com", 1);
  await testFarmer("amit@farmer.com", 12); // Amit Patil has 12 records total (1 legacy + 11 matched) Wait, it was 12 in the log: Amit Patil (F-002) linked requests: 12.
}

runTests().catch(console.error);
