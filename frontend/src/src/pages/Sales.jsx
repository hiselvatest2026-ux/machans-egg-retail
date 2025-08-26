import React, {useEffect, useState} from 'react'
import axios from 'axios'
const API = (import.meta.env.VITE_API_BASE || 'http://localhost:5000') + '/api'

export default function Sales(){
  const [items, setItems] = useState([])
  const [lines, setLines] = useState([])
  const [customer, setCustomer] = useState('')

  useEffect(()=>{ fetchSales(); },[])

  async function fetchSales(){ const res = await axios.get(API + '/sales'); setItems(res.data) }

  function addLine(){ setLines([...lines, {product_name:'', qty:1, price:0}]) }
  function updateLine(i,val){ const copy=[...lines]; copy[i]=val; setLines(copy) }
  function removeLine(i){ setLines(lines.filter((_,idx)=>idx!==i)) }

  async function save(){
    if(lines.length===0) return alert('add lines')
    const body = { customer_name: customer, items: lines }
    const res = await axios.post(API + '/sales', body)
    alert('Saved: ' + res.data.invoice_no)
    setCustomer(''); setLines([]); fetchSales()
  }

  async function del(inv){ if(!confirm('Delete '+inv)) return; await axios.delete(API + '/sales/'+inv); fetchSales() }

  return (<div>
    <h2>Sales</h2>
    <div style={{marginBottom:10}}>
      <input placeholder='Customer' value={customer} onChange={e=>setCustomer(e.target.value)} />
      <button onClick={addLine}>Add Line</button>
      <button onClick={save}>Save Sale</button>
    </div>
    <div>
      {lines.map((l,i)=> (
        <div key={i} style={{display:'flex',gap:8,marginBottom:6}}>
          <input placeholder='Product' value={l.product_name} onChange={e=>updateLine(i,{...l,product_name:e.target.value})} />
          <input type='number' style={{width:80}} value={l.qty} onChange={e=>updateLine(i,{...l,qty:parseInt(e.target.value)||0})} />
          <input type='number' style={{width:100}} value={l.price} onChange={e=>updateLine(i,{...l,price:parseFloat(e.target.value)||0})} />
          <div>₹{(l.qty*l.price).toFixed(2)}</div>
          <button onClick={()=>removeLine(i)}>X</button>
        </div>
      ))}
    </div>

    <h3>Recent Sales</h3>
    <table border='1' cellPadding='6'>
      <thead><tr><th>Invoice</th><th>Customer</th><th>Date</th><th>Total</th><th>Action</th></tr></thead>
      <tbody>
        {items.map(it=> (<tr key={it.invoice_no}><td>{it.invoice_no}</td><td>{it.customer_name}</td><td>{new Date(it.date).toLocaleString()}</td><td>₹{it.total}</td><td><button onClick={()=>del(it.invoice_no)}>Delete</button></td></tr>))}
      </tbody>
    </table>
  </div>)
}
