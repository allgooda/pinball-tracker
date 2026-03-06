// db.ts
// sets up the postgresql connection and creates tables if they don't exist yet

import { Pool } from 'pg';
console.log('DATABASE_URL:', process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

export async function initDb(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS machines (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS scores (
      id SERIAL PRIMARY KEY,
      score INTEGER NOT NULL,
      date TEXT NOT NULL,
      machine_id INTEGER NOT NULL REFERENCES machines(id)
    );
  `);
}

export default pool;