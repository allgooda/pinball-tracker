// db.ts
// sets up the sqlite database and creates tables if they don't exist yet

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = process.env.DB_DIR ?? path.join(__dirname, '../../data');
const dbPath = path.join(dbDir, 'pinball.db');

// create the data directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS machines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    score INTEGER NOT NULL,
    date TEXT NOT NULL,
    machine_id INTEGER NOT NULL,
    FOREIGN KEY (machine_id) REFERENCES machines (id)
  );
`);

export default db;