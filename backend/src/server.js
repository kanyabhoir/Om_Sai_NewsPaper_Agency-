// ============================================
//  SERVER.JS - Beginner friendly (with MongoDB)
// ============================================
// Flow:
//   React website  -->  Express server  -->  MongoDB Atlas
//
// Before: data saved in customers.json file
// Now:    data saved in MongoDB cloud database
// ============================================

// --------------------------------------------
// 1) IMPORT tools we need
// --------------------------------------------
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // talks to MongoDB
const path = require("path");
require("dotenv").config({
  // Always load .env from backend folder
  path: path.join(__dirname, "..", ".env"),
});

// Our Customer model (blueprint)
const Customer = require("./models/Customer");

// --------------------------------------------
// 2) CREATE the app
// --------------------------------------------
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// --------------------------------------------
// 3) MIDDLEWARE
// --------------------------------------------
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

// --------------------------------------------
// 4) CONNECT to MongoDB
// --------------------------------------------
// mongoose.connect() opens the connection to Atlas
async function connectDB() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env file");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed!");
    console.error(error.message);
    // Stop the app if database does not connect
    process.exit(1);
  }
}

// --------------------------------------------
// 5) API ROUTES
// --------------------------------------------
//
// GET    = read
// POST   = create
// PUT    = update
// DELETE = remove
//
// req = data from React
// res = data we send back
// --------------------------------------------

// Test route
app.get("/", function (req, res) {
  res.json({
    message: "Om Sai Newspaper Agency API is running",
    database: "MongoDB",
  });
});

// GET all customers
// GET http://localhost:5000/api/customers
app.get("/api/customers", async function (req, res) {
  try {
    // Customer.find() = get all customers from MongoDB
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// GET one customer by id
// GET http://localhost:5000/api/customers/ID_HERE
app.get("/api/customers/:id", async function (req, res) {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

// ADD a new customer
// POST http://localhost:5000/api/customers
// Body example: { "name": "Ramesh", "phone": "99999", "address": "Pune" }
app.post("/api/customers", async function (req, res) {
  try {
    const name = req.body.name;
    const phone = req.body.phone || "";
    const address = req.body.address || "";

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    // Customer.create() = save new customer in MongoDB
    const newCustomer = await Customer.create({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: "Failed to create customer" });
  }
});

// UPDATE a customer
// PUT http://localhost:5000/api/customers/ID_HERE
app.put("/api/customers/:id", async function (req, res) {
  try {
    const name = req.body.name;
    const phone = req.body.phone || "";
    const address = req.body.address || "";

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    // findByIdAndUpdate = find customer and update in one step
    // { new: true } means: return the updated customer
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: "Failed to update customer" });
  }
});

// DELETE a customer
// DELETE http://localhost:5000/api/customers/ID_HERE
app.delete("/api/customers/:id", async function (req, res) {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

    if (!deletedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

// --------------------------------------------
// 6) START server AFTER database connects
// --------------------------------------------
async function startServer() {
  await connectDB(); // first connect MongoDB

  app.listen(PORT, function () {
    console.log("=================================");
    console.log("Server is running!");
    console.log("Open: http://localhost:" + PORT);
    console.log("=================================");
  });
}

startServer();
