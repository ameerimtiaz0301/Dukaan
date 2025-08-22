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
        alert(`Welcome, ${data.user.username || data.user.email}!`);
        window.location = "home.html"; // redirect after login
      } else {
        alert(data.message);
      }
    })
    .catch(err => console.error("Error:", err));

  return false; // prevent form submit reload
}

// ✅ New function for redirecting to signup.html
function redirectToSignup() {
  window.location.href = "signup.html";
}
