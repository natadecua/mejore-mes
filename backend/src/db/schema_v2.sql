-- Updated Schema for Deep Sub-part Tracking
-- Run with: psql $DATABASE_URL -f schema_v2.sql

-- ─── 1. PROJECTS (The Contract Level) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  contract_value  DECIMAL(15,2),
  client_name     VARCHAR(255),
  status          VARCHAR(50) DEFAULT 'draft', -- draft | active | delivered
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. BOM HIERARCHY (The Tree) ──────────────────────────────────────────────
-- Supports: Finished Good -> Assembly -> Sub-Assembly -> Part -> Component (Hardware)
CREATE TABLE IF NOT EXISTS bom_nodes (
  id              SERIAL PRIMARY KEY,
  project_id      INT REFERENCES projects(id) ON DELETE CASCADE,
  parent_id       INT REFERENCES bom_nodes(id), -- Null if it's the top Finished Good
  item_name       VARCHAR(255) NOT NULL,
  sku             VARCHAR(100),
  description     TEXT,
  total_qty       DECIMAL(12,4) NOT NULL DEFAULT 1,
  completed_qty   DECIMAL(12,4) DEFAULT 0,
  level           INT DEFAULT 0, -- 0: Finished Good, 1: Assembly, 2: Part, etc.
  item_type       VARCHAR(50),   -- assembly | part | hardware | raw_material
  peso_weight     DECIMAL(5,2),  -- % of total project value this node represents
  ot_item_id      INT,           -- Link to Order Time Item
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. STATION LOGS (The Timing) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS station_logs (
  id              SERIAL PRIMARY KEY,
  node_id         INT REFERENCES bom_nodes(id),
  station_id      VARCHAR(100) NOT NULL,
  operator_id     VARCHAR(100),
  start_time      TIMESTAMPTZ NOT NULL,
  end_time        TIMESTAMPTZ,
  setup_time_sec  INT DEFAULT 0,
  run_time_sec    INT DEFAULT 0,
  units_produced  INT DEFAULT 0,
  status          VARCHAR(50) -- setup | running | completed | error
);

-- ─── 4. INCIDENTS (The Red Flags) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS incidents (
  id              SERIAL PRIMARY KEY,
  node_id         INT REFERENCES bom_nodes(id),
  station_id      VARCHAR(100),
  issue_type      VARCHAR(100), -- Material Fault | Tooling | Drawing Error
  description     TEXT,
  is_resolved     BOOLEAN DEFAULT FALSE,
  reported_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 5. BARCODES ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS barcodes (
  id              SERIAL PRIMARY KEY,
  node_id         INT REFERENCES bom_nodes(id),
  barcode_value   VARCHAR(100) UNIQUE NOT NULL,
  print_status    BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes for Performance ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_bom_parent ON bom_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_bom_project ON bom_nodes(project_id);
CREATE INDEX IF NOT EXISTS idx_logs_node ON station_logs(node_id);
