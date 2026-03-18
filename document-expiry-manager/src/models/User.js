const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
    sparse: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  whatsappOptIn: {
    type: Boolean,
    default: false,
  },
  emailNotifications: {
    type: Boolean,
    default: true,
  },
  reminderPreferences: {
    daysBefore: {
      type: [Number],
      default: [30, 15, 7, 3, 1], // Days before expiry to send reminders
    },
    whatsapp: {
      type: Boolean,
      default: false,
    },
    email: {
      type: Boolean,
      default: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
