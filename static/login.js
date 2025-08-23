function login() {
  var uname = document.getElementById("email").value;
  var pwd = document.getElementById("pwd1").value;

  fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: uname, password: pwd })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showPopup(`✅ Welcome, ${data.user.username || data.user.email}!`, "success");
        // Redirect after 2 seconds
        setTimeout(() => {
          window.location = "home.html";
        }, 2000);
      } else {
        showPopup("❌ " + data.message, "error");
      }
    })
    .catch(err => {
      console.error("Error:", err);
      showPopup("🚨 Cannot connect to server. Try again later.", "error");
    });

  return false; // prevent form submit reload
}

// ✅ New function for redirecting to signup.html
function redirectToSignup() {
  window.location.href = "signup.html";
}

// ✅ Popup function (same as signup.js)
function showPopup(message, type) {
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const closeBtn = document.getElementById("popup-close");

  popupMessage.textContent = message;

  // Optional: color by type
  if (type === "success") {
    popupMessage.style.color = "green";
  } else if (type === "error") {
    popupMessage.style.color = "red";
  } else {
    popupMessage.style.color = "#333";
  }

  popup.style.display = "flex";

  closeBtn.onclick = () => (popup.style.display = "none");
  popup.onclick = (e) => {
    if (e.target === popup) popup.style.display = "none";
  };
}
