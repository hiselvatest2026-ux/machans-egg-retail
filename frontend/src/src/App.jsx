import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Purchases from './pages/Purchases'
import Sales from './pages/Sales'
import Payments from './pages/Payments'
import Reports from './pages/Reports'

export default function App(){
  return (<BrowserRouter>
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h1>Machans Egg Retail</h1>
      <nav style={{display:'flex',gap:10,marginBottom:20}}>
        <Link to='/'>Purchases</Link>
        <Link to='/sales'>Sales</Link>
        <Link to='/payments'>Payments</Link>
        <Link to='/reports'>Reports</Link>
      </nav>
      <Routes>
        <Route path='/' element={<Purchases/>} />
        <Route path='/sales' element={<Sales/>} />
        <Route path='/payments' element={<Payments/>} />
        <Route path='/reports' element={<Reports/>} />
      </Routes>
    </div>
  </BrowserRouter>)
}
