const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Root route for Render health checks
app.get("/", (req, res) => {
  res.send("Machans Egg Retail Backend is running 🚀");
});

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "backend" });
});

// TODO: Add your other API routes: /api/purchases, /api/sales, etc.

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
