async function main() {
  const login = async (email: string, role: string) => {
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "password123" })
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log(`✅ Login successful for ${role} (${email}) - Received role: ${data.role}`);
      } else {
        console.log(`❌ Login failed for ${role} (${email}) - Status: ${res.status}`);
        console.log(await res.text());
      }
    } catch (e: any) {
      console.error(`Failed to connect for ${role}`, e.message);
    }
  };

  // The password for Admin might not be 'password123' if it's the hashed one.
  // But let's try. In the codebase, it falls back to plaintext equality if the hash doesn't start with $2a$. 
  // Since Admin has $2a$, it will use bcrypt. 
  await login("admin@aquavera.com", "Admin");
  await login("north@aquavera.com", "Sub-Admin");
  await login("vinayak@farmer.com", "Farmer");

  process.exit(0);
}

main();
