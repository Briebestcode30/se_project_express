require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI =
  "mongodb+srv://brieanaharris_db_user:OolDGBovsOde6pSG@cluster0.mjgp48g.mongodb.net/wtwr_db?retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());

app.use("/", mainRouter);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`🚀 Backend listening on port ${PORT}`);
});
