const express = require("express");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dummy users database (for demo)
let users = [
  {
    email: "test@example.com",
    password: bcrypt.hashSync("Test@1234", 10) // hashed password
  }
];

// Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ success: false, message: "Invalid password" });
  }

  res.json({ success: true, message: "Login successful" });
});

// Signup API
app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  const hashedPwd = bcrypt.hashSync(password, 10);
  users.push({ email, password: hashedPwd });

  res.json({ success: true, message: "Signup successful" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
