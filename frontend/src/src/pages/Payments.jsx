import React, {useEffect, useState} from 'react'
import axios from 'axios'
const API = (import.meta.env.VITE_API_BASE || 'http://localhost:5000') + '/api'

export default function Payments(){
  const [payments, setPayments] = useState([])
  const [invoice, setInvoice] = useState('')
  const [customer, setCustomer] = useState('')
  const [amount, setAmount] = useState(0)

  useEffect(()=>{ fetchPayments(); },[])
  async function fetchPayments(){ const res = await axios.get(API + '/payments'); setPayments(res.data) }

  async function save(){
    if(!amount) return alert('amount required')
    await axios.post(API + '/payments', { invoice_no: invoice||null, customer_name: customer, amount })
    setInvoice(''); setCustomer(''); setAmount(0); fetchPayments()
  }

  return (<div>
    <h2>Payments</h2>
    <div style={{marginBottom:10}}>
      <input placeholder='Invoice (optional)' value={invoice} onChange={e=>setInvoice(e.target.value)} />
      <input placeholder='Customer' value={customer} onChange={e=>setCustomer(e.target.value)} />
      <input type='number' placeholder='Amount' value={amount} onChange={e=>setAmount(parseFloat(e.target.value)||0)} />
      <button onClick={save}>Record Payment</button>
    </div>
    <h3>Recent Payments</h3>
    <table border='1' cellPadding='6'>
      <thead><tr><th>ID</th><th>Invoice</th><th>Customer</th><th>Amount</th><th>Date</th></tr></thead>
      <tbody>{payments.map(p=> (<tr key={p.id}><td>{p.id}</td><td>{p.invoice_no}</td><td>{p.customer_name}</td><td>₹{p.amount}</td><td>{new Date(p.date).toLocaleString()}</td></tr>))}</tbody>
    </table>
  </div>)
}
