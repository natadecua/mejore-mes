// backend/src/services/watcher.js
const chokidar = require('chokidar');
const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const watchDir = process.env.PYTHA_WATCH_DIR || '/mnt/pytha-exports';

console.log(`Starting PYTHA file watcher on: ${watchDir}`);

const watcher = chokidar.watch(watchDir, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

watcher.on('add', async (filePath) => {
  const filename = path.basename(filePath);
  console.log(`New PYTHA BOM detected: ${filename}`);
  
  try {
    // In POC, we just record the detection
    await pool.query(
      'INSERT INTO bom_imports (filename, status, log) VALUES ($1, $2, $3)',
      [filename, 'detected', `File added at ${filePath}`]
    );
    console.log(`Recorded import for ${filename}`);
  } catch (err) {
    console.error(`Error recording import: ${err.message}`);
  }
});

module.exports = watcher;
