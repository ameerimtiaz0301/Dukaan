const express = require("express");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");  // <-- add mysql2

const app = express();
const PORT = 5000;

// Middleware
const corsOptions = {
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,   // 👈 allow credentials
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});




// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",       // in WAMP usually blank
  database: "dukaan"  // the DB you created
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL connection error:", err);
  } else {
    console.log("✅ Connected to MySQL database dukaan");
  }
});

// Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please enter email and password" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "DB error" });
    if (results.length === 0) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    // ✅ Return username & email as well
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  });
});

// Log every incoming request (for debugging)
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// Signup API
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 👀 Log incoming data
    console.log("📩 Received signup request:", req.body);

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    // Check if user already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        console.error("❌ DB error:", err);
        return res.status(500).json({ success: false, message: "DB error", error: err.message });
      }

      if (results.length > 0) {
        return res.status(400).json({ success: false, message: "User already exists" });
      }

      // Hash password
      const hashedPwd = await bcrypt.hash(password, 10);

      // Insert new user
      db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPwd],
        (err, result) => {
          if (err) {
            console.error("❌ DB insert error:", err);
            return res.status(500).json({ success: false, message: "DB insert error", error: err.message });
          }
          console.log("✅ User inserted:", { id: result.insertId, username, email });
          return res.json({ success: true, message: "Signup successful", user: { id: result.insertId, username, email } });
        }
      );
    });
  } catch (err) {
    console.error("🔥 Unexpected error:", err);
    return res.status(500).json({ success: false, message: "Unexpected server error", error: err.message });
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
