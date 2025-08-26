import React from "react";
import Purchase from "./pages/Purchase";
import Sales from "./pages/Sales";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <div>
      <h1>Machans Egg Retail</h1>
      <Purchase />
      <Sales />
      <Payments />
      <Reports />
    </div>
  );
}
