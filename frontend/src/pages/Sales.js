import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [item, setItem] = useState("");

  useEffect(() => {
    api.get("/api/sales").then(res => setSales(res.data));
  }, []);

  const addSale = () => {
    const data = { id: Date.now().toString(), item };
    api.post("/api/sales", data).then(res => setSales([...sales, res.data]));
    setItem("");
  };

  return (
    <div>
      <h2>Sales</h2>
      <input value={item} onChange={e => setItem(e.target.value)} placeholder="Item name"/>
      <button onClick={addSale}>Add</button>
      <ul>{sales.map(s => <li key={s.id}>{s.item}</li>)}</ul>
    </div>
  );
}
