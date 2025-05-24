const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // Change if your MySQL password differs
  database: 'traveldb',
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ MySQL Connected!');
});

app.get('/api/destination/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM destinations WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ success: false, error: 'Destination not found' });
    }

    res.status(200).json({ success: true, data: results[0] });
  });
});

app.put('/api/destination/:id', (req, res) => {
  const { id } = req.params;
  const { name, country, visitDate, notes } = req.body;

  if (!name || !country || !visitDate) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const updateQuery = `
    UPDATE destinations 
    SET name = ?, country = ?, visitDate = ?, notes = ? 
    WHERE id = ?
  `;

  db.query(updateQuery, [name, country, visitDate, notes, id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Destination not found' });
    }

    res.status(200).json({ success: true, message: 'Destination updated successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
