// backend/src/db/migrate.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    console.log('Running database migrations...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bom_imports (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        import_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) NOT NULL,
        log TEXT
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS qc_photos (
        id SERIAL PRIMARY KEY,
        work_order_id VARCHAR(255) NOT NULL,
        filepath VARCHAR(255) NOT NULL,
        upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
