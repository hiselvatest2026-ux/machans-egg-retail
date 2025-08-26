import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function Purchase() {
  const [purchases, setPurchases] = useState([]);
  const [name, setName] = useState("");

  useEffect(()=>{api.get("/api/purchases").then(res=>setPurchases(res.data))},[]);

  const addPurchase = ()=>{
    const data = { id: Date.now().toString(), name };
    api.post("/api/purchases",data).then(res=>setPurchases([...purchases,res.data]));
    setName("");
  }

  return (
    <div>
      <h2>Purchases</h2>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Item name"/>
      <button onClick={addPurchase}>Add</button>
      <ul>{purchases.map(p=><li key={p.id}>{p.name}</li>)}</ul>
    </div>
  );
}
