// backend/src/services/watcher.js
// PYTHA export folder watcher
// Watches PYTHA_WATCH_DIR for new XML/CSV files, parses them, records in DB

const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const { parseBOM } = require('./pythaParser');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const watchDir = process.env.PYTHA_WATCH_DIR || './test-exports';
const processedDir = process.env.PYTHA_PROCESSED_DIR || './processed-exports';

// Ensure processed dir exists
fs.mkdirSync(processedDir, { recursive: true });

console.log(`🔍 PYTHA watcher active on: ${watchDir}`);

const watcher = chokidar.watch(watchDir, {
  ignored: /(^|[\/\\])\../,
  persistent: true,
  awaitWriteFinish: { stabilityThreshold: 1000, pollInterval: 200 }, // wait for write to complete
});

watcher.on('add', async (filePath) => {
  const filename = path.basename(filePath);
  const ext = filename.split('.').pop().toLowerCase();
  if (!['xml', 'csv'].includes(ext)) return;

  console.log(`📄 New PYTHA BOM: ${filename}`);

  // 1. Record detection in DB
  let importId;
  try {
    const res = await pool.query(
      `INSERT INTO bom_imports (filename, status, log) VALUES ($1, 'parsing', $2) RETURNING id`,
      [filename, `Detected at ${filePath}`]
    );
    importId = res.rows[0].id;
  } catch (err) {
    console.error(`DB insert failed: ${err.message}`);
    return;
  }

  // 2. Parse the BOM file
  let parsed;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    parsed = await parseBOM(content, filename);

    // Store parsed items in DB
    for (const bom of parsed) {
      for (const comp of bom.components) {
        await pool.query(
          `INSERT INTO bom_items (bom_import_id, item_name, description, quantity_per, step_name, uom, raw_data)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [importId, comp.itemName, comp.description, comp.quantityPer, comp.stepName, comp.uom, JSON.stringify(comp)]
        );
      }
    }

    await pool.query(
      `UPDATE bom_imports SET status = 'parsed', log = $1 WHERE id = $2`,
      [`Parsed ${parsed.length} BOM(s), ${parsed.reduce((s, b) => s + b.components.length, 0)} components`, importId]
    );

    console.log(`✅ Parsed ${filename}: ${parsed.length} assemblies`);
  } catch (err) {
    await pool.query(
      `UPDATE bom_imports SET status = 'error', log = $1 WHERE id = $2`,
      [`Parse error: ${err.message}`, importId]
    );
    console.error(`❌ Parse failed for ${filename}: ${err.message}`);
    return;
  }

  // 3. Move to processed dir
  try {
    const dest = path.join(processedDir, filename);
    fs.renameSync(filePath, dest);
    console.log(`📦 Moved ${filename} to processed dir`);
  } catch (err) {
    console.warn(`Could not move file: ${err.message}`);
  }
});

module.exports = watcher;
