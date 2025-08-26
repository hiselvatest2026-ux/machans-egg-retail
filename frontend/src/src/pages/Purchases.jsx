import React, { useEffect, useState } from "react";
import api from "../services/api";

function Purchase() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    api.get("/api/purchases")
      .then(res => setPurchases(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Purchase List</h2>
      <ul>
        {purchases.map(p => (
          <li key={p.id}>{p.item} - {p.quantity}</li>
        ))}
      </ul>
    </div>
  );
}

export default Purchase;
