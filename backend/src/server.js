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

// Our models (blueprints)
const Customer = require("./models/Customer");
const Newspaper = require("./models/Newspaper");

// Default newspaper names (seeded once if DB is empty)
const DEFAULT_NEWSPAPERS = [
  "नवभारत",
  "संध्यानंद",
  "पुण्यनगरी",
  "दिवाळी",
  "सामना",
  "आ.आनंद",
  "पुढारी",
  "साप्ताहिक",
  "The Hindu",
  "साक्षी",
  "नवाकाळ",
  "Mirror",
  "A.B.P.",
  "दिव्य भास्कर",
  "मु. समाचार",
  "तरुण भारत",
  "दैनिक भास्कर",
  "लोकमत",
  "H.T.",
  "सकाळ",
  "delivery bill",
  "F. Press",
  "Eco",
  "Magazine",
  "Patrika",
  "जन्मभूमी",
  "महाराष्ट्र टाइम्स",
  "लोकसत्ता",
  "नवभारत टाइम्स",
  "प्रत:काळ",
  "Mint",
  "finance",
  "Indian Express",
  "Wealth",
  "मुंबई चौफेर",
  "ठाणे वैभव",
  "दिनकरनं",
  "प्रत्यक्ष",
  "गुजरात समाचार",
  "Thanthi",
  "Manorama",
  "Mathrubhumi",
  "Uday Vani",
  "K. Mala",
  "G. Mid day",
  "E. Mid day",
  "B. Standard",
  "B. Line",
  "Times",
];

// --------------------------------------------
// 2) CREATE the app
// --------------------------------------------
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// --------------------------------------------
// 3) MIDDLEWARE
// --------------------------------------------
// Allow local React app + live GitHub Pages site
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://kanyabhoir.github.io",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow tools like Postman (no origin) and our websites
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
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

    // Seed default newspapers once (only if collection is empty)
    const newspaperCount = await Newspaper.countDocuments();
    if (newspaperCount === 0) {
      await Newspaper.insertMany(
        DEFAULT_NEWSPAPERS.map((name) => ({ name }))
      );
      console.log("Default newspapers seeded!");
    }
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

// GET all newspapers
app.get("/api/newspapers", async function (req, res) {
  try {
    const newspapers = await Newspaper.find().sort({ name: 1 });
    res.json(newspapers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch newspapers" });
  }
});

// GET one newspaper by id
app.get("/api/newspapers/:id", async function (req, res) {
  try {
    const newspaper = await Newspaper.findById(req.params.id);

    if (!newspaper) {
      return res.status(404).json({ error: "Newspaper not found" });
    }

    res.json(newspaper);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch newspaper" });
  }
});

// ADD a new newspaper
app.post("/api/newspapers", async function (req, res) {
  try {
    const name = req.body.name;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    const existing = await Newspaper.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ error: "Newspaper already exists" });
    }

    const newNewspaper = await Newspaper.create({
      name: name.trim(),
    });

    res.status(201).json(newNewspaper);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Newspaper already exists" });
    }
    res.status(500).json({ error: "Failed to create newspaper" });
  }
});

// UPDATE a newspaper
app.put("/api/newspapers/:id", async function (req, res) {
  try {
    const name = req.body.name;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    const updatedNewspaper = await Newspaper.findByIdAndUpdate(
      req.params.id,
      { name: name.trim() },
      { new: true }
    );

    if (!updatedNewspaper) {
      return res.status(404).json({ error: "Newspaper not found" });
    }

    res.json(updatedNewspaper);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Newspaper already exists" });
    }
    res.status(500).json({ error: "Failed to update newspaper" });
  }
});

// DELETE a newspaper
app.delete("/api/newspapers/:id", async function (req, res) {
  try {
    const deletedNewspaper = await Newspaper.findByIdAndDelete(req.params.id);

    if (!deletedNewspaper) {
      return res.status(404).json({ error: "Newspaper not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete newspaper" });
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
