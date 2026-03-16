// utils/config.js

module.exports = {
  // MongoDB Atlas connection string
  MONGO_URI:
    "mongodb+srv://brieanaharris_db_user:<db_ToriGirl12$mjgp48g.mongodb.net/wtwr_db?retryWrites=true&w=majority",

  // JWT secret for signing tokens
  JWT_SECRET: "your-very-secret-key",

  // Backend server port
  PORT: process.env.PORT || 3001,
};
