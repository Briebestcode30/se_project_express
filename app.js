const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Step 0: import cors
const mainRouter = require("./routes/index");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth"); // Auth middleware

const app = express();
const { PORT = 3001 } = process.env;

// ------------------------------
// Enable CORS for all origins
// ------------------------------
app.use(cors()); // <-- This allows requests from any origin
// Optional: you can configure it more specifically:
// app.use(cors({ origin: "http://localhost:3000" }));

// ------------------------------
// Parse JSON requests
// ------------------------------
app.use(express.json());

// ------------------------------
// MongoDB Atlas Connection
// ------------------------------
mongoose
  .connect(
    "mongodb+srv://brieanaharris_db_user:YeR61ZJP8GV8xjsx@cluster0.mjgp48g.mongodb.net/wtwr_db?retryWrites=true&w=majority",
  )
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB Atlas:", err);
  });

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
