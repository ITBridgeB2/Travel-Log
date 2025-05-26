const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.get('/api/destinations/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM destinations WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ success: false, error: 'Destination not found' });
    }

    res.status(200).json({ success: true, data: results[0] });
  });
});

app.put('/api/destinations/:id', (req, res) => {
  const { id } = req.params;
  const { name, country, visit_date, notes } = req.body;

  if (!name || !country || !visit_date) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const updateQuery = `
    UPDATE destinations 
    SET name = ?, country = ?, visit_date = ?, notes = ? 
    WHERE id = ?
  `;

  db.query(updateQuery, [name, country, visit_date, notes, id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Destination not found' });
    }

    res.status(200).json({ success: true, message: 'Destination updated successfully' });
  });
});

// Other routes...

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
