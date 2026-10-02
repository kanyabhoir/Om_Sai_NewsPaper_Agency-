// ============================================
// Customer MODEL (blueprint for one customer)
// ============================================
// MongoDB stores data as "documents" (like objects).
// A Model tells MongoDB what fields a customer has.
// ============================================

const mongoose = require("mongoose");

// Schema = the shape/structure of one customer
const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // name is must
      trim: true, // remove extra spaces
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt
    timestamps: true,
  }
);

// Model name "Customer" -> MongoDB collection becomes "customers"
const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
