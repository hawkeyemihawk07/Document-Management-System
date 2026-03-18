const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  documentNumber: {
    type: String,
    trim: true,
  },
  issuer: {
    type: String,
    trim: true,
  },
  issueDate: {
    type: Date,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  cost: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["active", "expired", "renewed"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", documentSchema);
