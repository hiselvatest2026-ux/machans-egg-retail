require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
app.use(cors());
app.use(express.json());
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function nextInvoice(prefix, seqName) {
  const { rows } = await pool.query('SELECT nextval($1) as seq', [seqName]);
  return `${prefix}-${String(rows[0].seq).padStart(5,'0')}`;
}

// create purchase
app.post('/api/purchases', async (req, res) => {
  const client = await pool.connect();
  try {
    const { supplier_name, date, items } = req.body;
    if (!items || items.length===0) return res.status(400).json({ error: 'items required' });
    const total = items.reduce((s,i)=> s + Number(i.qty)*Number(i.price), 0);
    const invoice_no = await nextInvoice('PUR','purchase_invoice_seq');
    await client.query('BEGIN');
    await client.query('INSERT INTO purchases (invoice_no,supplier_name,date,total) VALUES ($1,$2,COALESCE($3,now()),$4)', [invoice_no, supplier_name||null, date||null, total]);
    const insert = 'INSERT INTO line_items (invoice_no,product_name,qty,price,total,type) VALUES ($1,$2,$3,$4,$5,\'PURCHASE\')';
    for (const it of items) {
      await client.query(insert, [invoice_no, it.product_name, it.qty, it.price, Number(it.qty)*Number(it.price)]);
      // update inventory (increase)
      await client.query('INSERT INTO inventory (product_name,qty,last_updated) VALUES ($1,$2,now()) ON CONFLICT (product_name) DO UPDATE SET qty = inventory.qty + EXCLUDED.qty, last_updated = now()', [it.product_name, it.qty]);
    }
    await client.query('COMMIT');
    res.json({ invoice_no, total });
  } catch (err) {
    await client.query('ROLLBACK').catch(()=>{});
    console.error(err);
    res.status(500).json({ error: 'internal' });
  } finally {
    client.release();
  }
});

// list purchases
app.get('/api/purchases', async (req,res)=>{
  try {
    const { rows } = await pool.query('SELECT * FROM purchases ORDER BY id DESC');
    res.json(rows);
  } catch(e){ console.error(e); res.status(500).json({error:'internal'}); }
});

app.delete('/api/purchases/:invoice_no', async (req,res)=>{
  const client = await pool.connect();
  try {
    const { invoice_no } = req.params;
    await client.query('BEGIN');
    // get items to adjust inventory
    const items = (await client.query('SELECT product_name,qty FROM line_items WHERE invoice_no=$1 AND type=$2',[invoice_no,'PURCHASE'])).rows;
    for (const it of items) {
      await client.query('UPDATE inventory SET qty = qty - $1, last_updated = now() WHERE product_name=$2',[it.qty,it.product_name]);
    }
    await client.query('DELETE FROM line_items WHERE invoice_no=$1 AND type=$2',[invoice_no,'PURCHASE']);
    await client.query('DELETE FROM purchases WHERE invoice_no=$1',[invoice_no]);
    await client.query('COMMIT');
    res.json({ ok:true });
  } catch(e){ await client.query('ROLLBACK').catch(()=>{}); console.error(e); res.status(500).json({error:'internal'});} finally { client.release(); }
});

// sales
app.post('/api/sales', async (req,res)=>{
  const client = await pool.connect();
  try {
    const { customer_name, date, items } = req.body;
    if (!items || items.length===0) return res.status(400).json({ error: 'items required' });
    const total = items.reduce((s,i)=> s + Number(i.qty)*Number(i.price), 0);
    const invoice_no = await nextInvoice('SAL','sale_invoice_seq');
    await client.query('BEGIN');
    await client.query('INSERT INTO sales (invoice_no,customer_name,date,total) VALUES ($1,$2,COALESCE($3,now()),$4)', [invoice_no, customer_name||null, date||null, total]);
    const insert = 'INSERT INTO line_items (invoice_no,product_name,qty,price,total,type) VALUES ($1,$2,$3,$4,$5,\'SALE\')';
    for (const it of items) {
      await client.query(insert, [invoice_no, it.product_name, it.qty, it.price, Number(it.qty)*Number(it.price)]);
      // deduct inventory
      await client.query('UPDATE inventory SET qty = GREATEST(qty - $1,0), last_updated = now() WHERE product_name=$2',[it.qty,it.product_name]);
    }
    await client.query('COMMIT');
    res.json({ invoice_no, total });
  } catch(e){ await client.query('ROLLBACK').catch(()=>{}); console.error(e); res.status(500).json({error:'internal'});} finally { client.release(); }
});

app.get('/api/sales', async (req,res)=>{
  try { const { rows } = await pool.query('SELECT * FROM sales ORDER BY id DESC'); res.json(rows); } catch(e){ console.error(e); res.status(500).json({error:'internal'}); }
});

app.delete('/api/sales/:invoice_no', async (req,res)=>{
  const client = await pool.connect();
  try {
    const { invoice_no } = req.params;
    await client.query('BEGIN');
    const items = (await client.query('SELECT product_name,qty FROM line_items WHERE invoice_no=$1 AND type=$2',[invoice_no,'SALE'])).rows;
    for (const it of items) {
      await client.query('UPDATE inventory SET qty = qty + $1, last_updated = now() WHERE product_name=$2',[it.qty,it.product_name]);
    }
    await client.query('DELETE FROM line_items WHERE invoice_no=$1 AND type=$2',[invoice_no,'SALE']);
    await client.query('DELETE FROM sales WHERE invoice_no=$1',[invoice_no]);
    await client.query('COMMIT');
    res.json({ ok:true });
  } catch(e){ await client.query('ROLLBACK').catch(()=>{}); console.error(e); res.status(500).json({error:'internal'});} finally { client.release(); }
});

// payments
app.post('/api/payments', async (req,res)=>{
  try {
    const { invoice_no, customer_name, amount } = req.body;
    await pool.query('INSERT INTO payments (invoice_no, customer_name, amount) VALUES ($1,$2,$3)', [invoice_no||null, customer_name||null, amount]);
    res.json({ ok:true });
  } catch(e){ console.error(e); res.status(500).json({error:'internal'}); }
});

app.get('/api/payments', async (req,res)=>{
  try { const { rows } = await pool.query('SELECT * FROM payments ORDER BY id DESC'); res.json(rows);} catch(e){ console.error(e); res.status(500).json({error:'internal'}); }
});

// invoice fetch
app.get('/api/invoices/:invoice_no', async (req,res)=>{
  try {
    const { invoice_no } = req.params;
    const p = await pool.query('SELECT * FROM purchases WHERE invoice_no=$1',[invoice_no]);
    const s = await pool.query('SELECT * FROM sales WHERE invoice_no=$1',[invoice_no]);
    let invoice = null;
    if (p.rowCount>0) invoice = { kind:'PURCHASE', ...p.rows[0] };
    else if (s.rowCount>0) invoice = { kind:'SALE', ...s.rows[0] };
    else return res.status(404).json({ error:'not found' });
    const items = (await pool.query('SELECT product_name,qty,price,total,type FROM line_items WHERE invoice_no=$1 ORDER BY id',[invoice_no])).rows;
    res.json({ invoice, items });
  } catch(e){ console.error(e); res.status(500).json({error:'internal'}); }
});

// inventory
app.get('/api/inventory', async (req,res)=>{
  try { const { rows } = await pool.query('SELECT * FROM inventory ORDER BY product_name'); res.json(rows); } catch(e){ console.error(e); res.status(500).json({error:'internal'}); }
});

// reports: basic aggregates
app.get('/api/reports/sales', async (req,res)=>{
  try {
    const { rows } = await pool.query('SELECT invoice_no, customer_name, date, total FROM sales ORDER BY date DESC LIMIT 200');
    res.json(rows);
  } catch(e){ console.error(e); res.status(500).json({error:'internal'}); }
});
app.get('/api/reports/purchases', async (req,res)=>{
  try {
    const { rows } = await pool.query('SELECT invoice_no, supplier_name, date, total FROM purchases ORDER BY date DESC LIMIT 200');
    res.json(rows);
  } catch(e){ console.error(e); res.status(500).json({error:'internal'}); }
});

const port = process.env.PORT || 5000;
app.listen(port, ()=> console.log('Backend listening on', port));
