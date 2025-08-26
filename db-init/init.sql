-- sequences
CREATE SEQUENCE IF NOT EXISTS purchase_invoice_seq START 1;
CREATE SEQUENCE IF NOT EXISTS sale_invoice_seq START 1;

-- purchases
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  invoice_no VARCHAR(32) UNIQUE NOT NULL,
  supplier_name VARCHAR(255),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total NUMERIC(12,2) NOT NULL
);

-- sales
CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  invoice_no VARCHAR(32) UNIQUE NOT NULL,
  customer_name VARCHAR(255),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total NUMERIC(12,2) NOT NULL
);

-- line items
CREATE TABLE IF NOT EXISTS line_items (
  id SERIAL PRIMARY KEY,
  invoice_no VARCHAR(32) NOT NULL,
  product_name VARCHAR(255),
  qty INT,
  price NUMERIC(12,2),
  total NUMERIC(12,2),
  type VARCHAR(12) CHECK (type IN ('PURCHASE','SALE')) NOT NULL
);

-- payments
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  invoice_no VARCHAR(32),
  customer_name VARCHAR(255),
  amount NUMERIC(12,2),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- inventory
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255),
  qty INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lineitems_invoice ON line_items (invoice_no);
