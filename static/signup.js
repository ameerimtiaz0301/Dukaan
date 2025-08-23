document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault(); // stop page reload

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const loadingEl = document.getElementById("loading");

  if (!email || !password) {
    alert("⚠️ Please enter email and password");
    return;
  }

  try {
    // show loading
    loadingEl.style.display = "block";

    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("Response data:", data);

    if (data.success) {
      alert("✅ Signup successful! Please login now.");
      window.location = "login.html";
    } else {
      alert("❌ Signup failed: " + data.message);
    }
  } catch (err) {
    console.error("🔥 Fetch error:", err);
    alert("🚨 Cannot reach server. Please try again later.");
  } finally {
    // always hide loading
    loadingEl.style.display = "none";
  }
});
