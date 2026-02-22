// backend/src/routes/bom.js
// BOM routes: manual import + list imports + list parsed items
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const { parseBOM } = require('../services/pythaParser');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Multer: store uploads temporarily
const upload = multer({ dest: '/tmp/bom-uploads/' });

// ── POST /api/bom/import — upload a PYTHA XML/CSV file directly ───────────────
router.post('/import', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded. Send as multipart field "file".' });

  const filename = req.file.originalname;
  let importId;

  try {
    // 1. Record import
    const dbRes = await pool.query(
      `INSERT INTO bom_imports (filename, status, log) VALUES ($1, 'parsing', 'Manual upload') RETURNING id`,
      [filename]
    );
    importId = dbRes.rows[0].id;

    // 2. Parse
    const content = fs.readFileSync(req.file.path, 'utf8');
    const parsed = await parseBOM(content, filename);

    // 3. Store BOM items
    let totalComponents = 0;
    for (const bom of parsed) {
      for (const comp of bom.components) {
        await pool.query(
          `INSERT INTO bom_items (bom_import_id, item_name, description, quantity_per, step_name, uom, raw_data)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [importId, comp.itemName, comp.description, comp.quantityPer, comp.stepName, comp.uom, JSON.stringify(comp)]
        );
        totalComponents++;
      }
    }

    await pool.query(
      `UPDATE bom_imports SET status = 'parsed', log = $1 WHERE id = $2`,
      [`Parsed ${parsed.length} BOM(s), ${totalComponents} components`, importId]
    );

    res.status(201).json({
      importId,
      assemblies: parsed.length,
      totalComponents,
      boms: parsed,
    });
  } catch (err) {
    if (importId) {
      await pool.query(
        `UPDATE bom_imports SET status = 'error', log = $1 WHERE id = $2`,
        [err.message, importId]
      );
    }
    res.status(500).json({ error: err.message });
  } finally {
    if (req.file) fs.unlinkSync(req.file.path).catch?.(() => {});
  }
});

// ── GET /api/bom/imports — list all BOM imports ───────────────────────────────
router.get('/imports', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bom_imports ORDER BY import_date DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/bom/imports/:id/items — get parsed items for an import ───────────
router.get('/imports/:id/items', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM bom_items WHERE bom_import_id = $1 ORDER BY id',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
