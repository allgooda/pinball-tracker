import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(__dirname, '../../data/pinball.db');
const db = new Database(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS machines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
    CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        score INTEGER NOT NULL,
        date TEXT NOT NULL,
        machine_id INTEGER NOT NULL,
        FOREIGN KEY (machine_id) REFERENCES machines(id)
    )
`);

export default db;
