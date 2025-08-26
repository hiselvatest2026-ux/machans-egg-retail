import React, {useEffect, useState} from 'react'
import axios from 'axios'
const API = (import.meta.env.VITE_API_BASE || 'http://localhost:5000') + '/api'

export default function Purchases(){
  const [items, setItems] = useState([])
  const [lines, setLines] = useState([])
  const [supplier, setSupplier] = useState('')

  useEffect(()=>{ fetchPurchases(); },[])

  async function fetchPurchases(){
    const res = await axios.get(API + '/purchases'); setItems(res.data)
  }

  function addLine(){ setLines([...lines, {product_name:'', qty:1, price:0}]) }
  function updateLine(i,val){ const copy=[...lines]; copy[i]=val; setLines(copy) }
  function removeLine(i){ setLines(lines.filter((_,idx)=>idx!==i)) }

  async function save(){
    if(lines.length===0) return alert('add lines')
    const body = { supplier_name: supplier, items: lines }
    const res = await axios.post(API + '/purchases', body)
    alert('Saved: ' + res.data.invoice_no)
    setSupplier(''); setLines([]); fetchPurchases()
  }

  async function del(inv){ if(!confirm('Delete '+inv)) return; await axios.delete(API + '/purchases/'+inv); fetchPurchases() }

  return (<div>
    <h2>Purchases</h2>
    <div style={{marginBottom:10}}>
      <input placeholder='Supplier' value={supplier} onChange={e=>setSupplier(e.target.value)} />
      <button onClick={addLine}>Add Line</button>
      <button onClick={save}>Save Purchase</button>
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

    <h3>Recent Purchases</h3>
    <table border='1' cellPadding='6'>
      <thead><tr><th>Invoice</th><th>Supplier</th><th>Date</th><th>Total</th><th>Action</th></tr></thead>
      <tbody>
        {items.map(it=> (<tr key={it.invoice_no}><td>{it.invoice_no}</td><td>{it.supplier_name}</td><td>{new Date(it.date).toLocaleString()}</td><td>₹{it.total}</td><td><button onClick={()=>del(it.invoice_no)}>Delete</button></td></tr>))}
      </tbody>
    </table>
  </div>)
}
