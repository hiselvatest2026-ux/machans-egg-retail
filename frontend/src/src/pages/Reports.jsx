import React, {useEffect, useState} from 'react'
import axios from 'axios'
const API = (import.meta.env.VITE_API_BASE || 'http://localhost:5000') + '/api'

export default function Reports(){
  const [sales, setSales] = useState([])
  const [purchases, setPurchases] = useState([])
  const [inventory, setInventory] = useState([])

  useEffect(()=>{ fetchAll(); },[])
  async function fetchAll(){
    const [s,p,i] = await Promise.all([axios.get(API+'/reports/sales'), axios.get(API+'/reports/purchases'), axios.get(API+'/inventory')])
    setSales(s.data); setPurchases(p.data); setInventory(i.data)
  }

  return (<div>
    <h2>Reports</h2>
    <h3>Sales</h3>
    <table border='1' cellPadding='6'><thead><tr><th>Inv</th><th>Customer</th><th>Date</th><th>Total</th></tr></thead><tbody>{sales.map(r=> (<tr key={r.invoice_no}><td>{r.invoice_no}</td><td>{r.customer_name}</td><td>{new Date(r.date).toLocaleString()}</td><td>₹{r.total}</td></tr>))}</tbody></table>
    <h3>Purchases</h3>
    <table border='1' cellPadding='6'><thead><tr><th>Inv</th><th>Supplier</th><th>Date</th><th>Total</th></tr></thead><tbody>{purchases.map(r=> (<tr key={r.invoice_no}><td>{r.invoice_no}</td><td>{r.supplier_name}</td><td>{new Date(r.date).toLocaleString()}</td><td>₹{r.total}</td></tr>))}</tbody></table>
    <h3>Inventory</h3>
    <table border='1' cellPadding='6'><thead><tr><th>Product</th><th>Qty</th></tr></thead><tbody>{inventory.map(i=> (<tr key={i.product_name}><td>{i.product_name}</td><td>{i.qty}</td></tr>))}</tbody></table>
  </div>)
}
