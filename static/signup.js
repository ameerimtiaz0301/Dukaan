function showPopup(message, type = "info") {
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  popupMessage.textContent = message;

  // set success/error style
  popup.classList.remove("success", "error");
  if (type === "success") popup.classList.add("success");
  if (type === "error") popup.classList.add("error");

  popup.style.display = "flex";

  // close on click of X
  document.getElementById("popup-close").onclick = () => {
    popup.style.display = "none";
  };

  // close if user clicks outside
  window.onclick = (event) => {
    if (event.target === popup) {
      popup.style.display = "none";
    }
  };
}

document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault(); // stop page reload

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const loadingEl = document.getElementById("loading");

  if (!email || !password) {
    showPopup("⚠️ Please enter email and password", "error");
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
      showPopup("✅ Signup successful! Please login now.", "success");
      // Redirect after 2 sec
      setTimeout(() => {
        window.location = "login.html";
      }, 2000);
    } else {
      showPopup("❌ Signup failed: " + data.message, "error");
    }

  } catch (err) {
    console.error("🔥 Fetch error:", err);
    showPopup("🚨 Cannot reach server. Please try again later.", "error");
  } finally {
    // always hide loading
    loadingEl.style.display = "none";
  }
});
