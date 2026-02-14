const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Enable cross-origin requests
const mainRouter = require("./routes/index");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");

const app = express();
const { PORT = 3001 } = process.env;

// ------------------------------
// Enable CORS for all origins
// ------------------------------
app.use(cors()); // allows requests from any origin
// Optional: restrict to specific origin
// app.use(cors({ origin: "http://localhost:3000" }));

// ------------------------------
// Parse JSON requests
// ------------------------------
app.use(express.json());

// ------------------------------
// MongoDB Connection (local DB)
// ------------------------------
mongoose
  .connect("mongodb://localhost:27017/wtwr_db") // Local DB per checklist
  .then(() => console.log("✅ Connected to local MongoDB"))
  .catch((err) => console.error("❌ Error connecting to MongoDB:", err));

// ------------------------------
// Public routes: Signup & Signin
// ------------------------------
app.post("/signup", createUser);
app.post("/signin", login);

// ------------------------------
// Protect all other routes
// ------------------------------
app.use(auth); // Only authenticated users can access routes below

// ------------------------------
// Other routes
// ------------------------------
app.use("/", mainRouter);

// ------------------------------
// Start server
// ------------------------------
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
