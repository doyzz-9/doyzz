const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./jb.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    old_price INTEGER,
    kategori TEXT NOT NULL,
    wa TEXT NOT NULL,
    image TEXT,
    promo TEXT,
    seller TEXT DEFAULT 'JB Cash Flow',
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )`);

  db.get(`SELECT * FROM settings WHERE key = 'bantuan'`, (err, row) => {
    if (!row) {
      db.run(`INSERT INTO settings (key, value) VALUES ('bantuan', 'Hubungi admin JB Cash Flow di +62 883-8003-5722 untuk bantuan.')`);
    }
  });
});

module.exports = db;