app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/products', auth, (req, res) => {
  const { name, price, old_price, kategori, wa, image, promo } = req.body;
  db.run(`INSERT INTO products (name, price, old_price, kategori, wa, image, promo) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, price, old_price || null, kategori, wa, image, promo || ''],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      db.run('INSERT INTO logs (message) VALUES (?)', [`Menambahkan produk: ${name}`]);
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.delete('/api/products/:id', auth, (req, res) => {
  db.get('SELECT name FROM products WHERE id = ?', [req.params.id], (err, product) => {
    db.run('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (product) db.run('INSERT INTO logs (message) VALUES (?)', [`Menghapus produk (Laku): ${product.name}`]);
    res.json({ success: true });
  });
});

app.get('/api/logs', auth, (req, res) => {
  db.all('SELECT * FROM logs ORDER BY id DESC LIMIT 20', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/settings/bantuan', (req, res) => {
  db.get("SELECT value FROM settings WHERE key = 'bantuan'", [], (err, row) => {
    res.json({ bantuan: row ? row.value : '' });
  });
});

app.post('/api/settings/bantuan', auth, (req, res) => {
  db.run("INSERT INTO settings (key, value) VALUES ('bantuan', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", [req.body.bantuan]);
  db.run('INSERT INTO logs (message) VALUES (?)', [`Mengupdate teks bantuan`]);
  res.json({ success: true });
});