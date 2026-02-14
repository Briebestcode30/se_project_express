const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The "name" field must be filled in'],
    minlength: [2, 'The minimum length of the "name" field is 2'],
    maxlength: [30, 'The maximum length of the "name" field is 30'],
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required"],
    validate: {
      validator: (value) => validator.isURL(value),
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [validator.isEmail, "Invalid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
    select: false, // Hide password by default
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Custom login method (task 9: handle password safely)
userSchema.statics.findUserByCredentials = async function (email, password) {
  // Include password explicitly for login
  const user = await this.findOne({ email }).select("+password");
  if (!user) throw new Error("Incorrect email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Incorrect email or password");

  return user;
};

// Remove password from user object before sending response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
