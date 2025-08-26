const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Root route
app.get("/", (req, res) => {
  res.send("✅ Machans Egg Retail Backend is running. Use /api/... for endpoints.");
});

// Example API route
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from backend API" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
