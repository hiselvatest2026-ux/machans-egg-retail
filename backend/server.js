const express = require("express");
const cors = require("cors");

const app = express();

// Allow frontend Render domain + localhost
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://machans-egg-retail-1.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());

// Example route
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend running OK!" });
});

// Import your routes here (purchase, sales, etc.)
// const purchaseRoutes = require("./routes/purchase");
// app.use("/api/purchases", purchaseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
