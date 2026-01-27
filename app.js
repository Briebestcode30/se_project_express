const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

// Parse JSON bodies
app.use(express.json());

/*
mongodb+srv://brieanaharris_db_user:YeR61ZJP8GV8xjsx@cluster0.mjgp48g.mongodb.net/wtwr_db?appName=Cluster0
*/

mongoose
  .connect(
    "mongodb+srv://brieanaharris_db_user:YeR61ZJP8GV8xjsx@cluster0.mjgp48g.mongodb.net/wtwr_db?appName=Cluster0",
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

// Corrected middleware usage
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
