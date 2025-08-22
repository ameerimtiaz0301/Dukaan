async function signup() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter email and password");
    return false;
  }

  try {
    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    console.log("🔍 Raw Response:", res);

    // If response is NOT ok (e.g. 400, 500), throw error
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    console.log("✅ Response JSON:", data);

    if (data.success) {
      alert("Signup successful! Please login now.");
      window.location = "login.html"; // redirect after success
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    alert("Cannot reach server: " + err.message);
  }

  return false;
}
