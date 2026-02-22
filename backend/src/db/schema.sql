-- Mejore MES Full Schema
-- Run with: psql $DATABASE_URL -f schema.sql

-- ─── BOM Imports (PYTHA file tracking) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS bom_imports (
  id            SERIAL PRIMARY KEY,
  filename      VARCHAR(255) NOT NULL,
  import_date   TIMESTAMPTZ DEFAULT NOW(),
  status        VARCHAR(50)  NOT NULL DEFAULT 'detected',
  -- status: detected | parsing | parsed | pushed_to_ot | error
  log           TEXT,
  ot_bom_id     INT          -- BOM id returned from OT after push
);

-- ─── BOM Line Items (parsed from PYTHA XML/CSV) ───────────────────────────────
CREATE TABLE IF NOT EXISTS bom_items (
  id              SERIAL PRIMARY KEY,
  bom_import_id   INT REFERENCES bom_imports(id) ON DELETE CASCADE,
  item_name       VARCHAR(255) NOT NULL,  -- maps to OT ItemRef.Name
  description     TEXT,
  quantity_per    DECIMAL(12,4) NOT NULL DEFAULT 1,
  step_name       VARCHAR(100) DEFAULT 'Default',  -- maps to OT BomStep StepRef.Name
  uom             VARCHAR(50)  DEFAULT 'EA',
  std_cost        DECIMAL(12,4),
  is_costed       BOOLEAN DEFAULT TRUE,
  raw_data        JSONB,                 -- raw parsed row for debugging
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Work Orders (synced from Order Time) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS work_orders (
  id              SERIAL PRIMARY KEY,
  ot_doc_no       INT UNIQUE,            -- OT WorkOrder.DocNo
  ot_item_ref     VARCHAR(255),          -- OT WorkOrder.ItemRef.Name (finished good)
  quantity_ordered DECIMAL(12,4),
  promise_date    DATE,
  status          VARCHAR(100),          -- OT StatusRef.Name: Open | In Production | Finished
  memo            TEXT,
  instructions    TEXT,
  bom_import_id   INT REFERENCES bom_imports(id),
  synced_at       TIMESTAMPTZ DEFAULT NOW(),
  raw_payload     JSONB                  -- full OT response
);

-- ─── QC Photos ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS qc_photos (
  id              SERIAL PRIMARY KEY,
  work_order_id   INT REFERENCES work_orders(id) ON DELETE SET NULL,
  ot_doc_no       INT,                   -- direct reference if WO not yet in local DB
  filepath        VARCHAR(500) NOT NULL,
  original_name   VARCHAR(255),
  uploaded_by     VARCHAR(100),
  upload_date     TIMESTAMPTZ DEFAULT NOW(),
  notes           TEXT
);

-- ─── QB Invoices (read-only cache) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS qb_invoices (
  id              SERIAL PRIMARY KEY,
  qb_id           VARCHAR(50) UNIQUE,    -- QBO Invoice.Id
  doc_number      VARCHAR(50),           -- QBO Invoice.DocNumber
  txn_date        DATE,
  customer_name   VARCHAR(255),
  total_amt       DECIMAL(12,2),
  balance         DECIMAL(12,2),
  status          VARCHAR(50),           -- Paid | Partial | Open
  synced_at       TIMESTAMPTZ DEFAULT NOW(),
  raw_payload     JSONB
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_bom_items_import ON bom_items(bom_import_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_ot ON work_orders(ot_doc_no);
CREATE INDEX IF NOT EXISTS idx_qc_photos_wo ON qc_photos(work_order_id);
CREATE INDEX IF NOT EXISTS idx_qb_invoices_qbid ON qb_invoices(qb_id);
