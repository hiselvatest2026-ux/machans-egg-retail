const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors({
  origin: ["https://machans-egg-retail-1.onrender.com", "http://localhost:3000"],
  credentials: true
}));
app.use(bodyParser.json());

let purchases = [], sales = [], payments = [];

app.get("/", (req,res)=>res.send("Machans Egg Retail Backend is running 🚀"));
app.get("/api/health",(req,res)=>res.json({status:"ok", service:"backend"}));

app.get("/api/purchases",(req,res)=>res.json(purchases));
app.post("/api/purchases",(req,res)=>{purchases.push(req.body); res.json(req.body);});
app.put("/api/purchases/:id",(req,res)=>{const idx=purchases.findIndex(p=>p.id===req.params.id); if(idx>=0)purchases[idx]=req.body; res.json(req.body);});
app.delete("/api/purchases/:id",(req,res)=>{purchases=purchases.filter(p=>p.id!==req.params.id); res.json({deleted:true});});

app.get("/api/sales",(req,res)=>res.json(sales));
app.post("/api/sales",(req,res)=>{sales.push(req.body); res.json(req.body);});
app.put("/api/sales/:id",(req,res)=>{const idx=sales.findIndex(s=>s.id===req.params.id); if(idx>=0)sales[idx]=req.body; res.json(req.body);});
app.delete("/api/sales/:id",(req,res)=>{sales=sales.filter(s=>s.id!==req.params.id); res.json({deleted:true});});

app.get("/api/payments",(req,res)=>res.json(payments));
app.post("/api/payments",(req,res)=>{payments.push(req.body); res.json(req.body);});
app.put("/api/payments/:id",(req,res)=>{const idx=payments.findIndex(p=>p.id===req.params.id); if(idx>=0)payments[idx]=req.body; res.json(req.body);});
app.delete("/api/payments/:id",(req,res)=>{payments=payments.filter(p=>p.id!==req.params.id); res.json({deleted:true});});

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Backend running on port ${PORT}`));
