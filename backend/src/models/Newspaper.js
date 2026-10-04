// ============================================
// Newspaper MODEL (blueprint for one newspaper name)
// ============================================

const mongoose = require("mongoose");

const newspaperSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Newspaper = mongoose.model("Newspaper", newspaperSchema);

module.exports = Newspaper;
