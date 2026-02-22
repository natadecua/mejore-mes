// backend/src/routes/projects.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ── GET /api/projects — List all active contracts ────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/projects/:id/tree — Get the full BOM hierarchy ──────────────────
router.get('/:id/tree', async (req, res) => {
  try {
    // Basic recursive query or simple fetch for PoC
    const result = await pool.query(
      'SELECT * FROM bom_nodes WHERE project_id = $1 ORDER BY level, id',
      [req.params.id]
    );
    
    // Convert flat list to tree
    const list = result.rows;
    const map = {};
    const tree = [];

    list.forEach(node => {
      map[node.id] = { ...node, children: [] };
    });

    list.forEach(node => {
      if (node.parent_id) {
        map[node.parent_id].children.push(map[node.id]);
      } else {
        tree.push(map[node.id]);
      }
    });

    res.json(tree);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/projects — Create a new contract ───────────────────────────────
router.post('/', async (req, res) => {
  const { name, contract_value, client_name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO projects (name, contract_value, client_name, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, contract_value, client_name, 'active']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
