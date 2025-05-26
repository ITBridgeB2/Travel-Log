require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Create MySQL Pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL connection failed:', err);
  } else {
    console.log('Connected to MySQL using pool');
    connection.release(); // Always release the connection
  }
});

// ✅ POST /destinations
app.post('/destinations', (req, res) => {
  const { name, country, visit_date, notes } = req.body;

  if (!name || !country || !visit_date) {
    return res.status(400).json({ error: 'Name, country, and visit_date are required' });
  }

  const sql = `INSERT INTO destinations (name, country, visit_date, notes) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, country, visit_date, notes], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Error saving destination' });
    }
    res.status(201).json({
      id: result.insertId,
      name,
      country,
      visit_date,
      notes,
      created_at: new Date().toISOString(),
    });
  });
});

// ✅ GET /destinations (with optional filters)
app.get('/destinations', (req, res) => {
  const { year, country } = req.query;

  let query = 'SELECT * FROM destinations WHERE 1';
  const values = [];

  if (year) {
    query += ' AND YEAR(visit_date) = ?';
    values.push(year);
  }

  if (country) {
    query += ' AND country = ?';
    values.push(country);
  }

  query += ' ORDER BY visit_date DESC';

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error fetching destinations:', err);
      return res.status(500).json({ error: 'Failed to fetch destinations' });
    }
    res.status(200).json(results);
  });
});
//------------------------------------------------------------------------------------------------------
// ✅ GET /destinations/:id
app.get('/destinations/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM destinations WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching destination:', err);
      return res.status(500).json({ error: 'Failed to fetch destination' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    res.status(200).json(results[0]); // No need for `data` wrapper unless you want
  });
});
//----------------------------------------------------
// ✅ PUT /destinations/:id
app.put('/destinations/:id', (req, res) => {
  const { id } = req.params;
  const { name, country, visit_date, notes, rating } = req.body;

  if (!name || !country || !visit_date) {
    return res.status(400).json({ error: 'Name, country, and visit_date are required' });
  }

  const sql = `
    UPDATE destinations 
    SET name = ?, country = ?, visit_date = ?, notes = ?, rating = ?
    WHERE id = ?
  `;

  db.query(sql, [name, country, visit_date, notes, rating ?? null, id], (err, result) => {
    if (err) {
      console.error('Error updating destination:', err);
      return res.status(500).json({ error: 'Failed to update destination' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    res.status(200).json({ message: 'Destination updated successfully' });
  });
});
//-------------------------------------------------------------------------------------------------------
// ✅ PATCH /destinations/:id
app.patch('/destinations/:id', (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  if (rating == null) {
    return res.status(400).json({ error: 'Rating is required for patch' });
  }

  const sql = 'UPDATE destinations SET rating = ? WHERE id = ?';

  db.query(sql, [rating, id], (err, result) => {
    if (err) {
      console.error('Error updating rating:', err);
      return res.status(500).json({ error: 'Failed to update rating' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    res.status(200).json({ message: 'Rating updated successfully' });
  });
});


// ✅ DELETE /destinations/:id
app.delete('/destinations/:id', (req, res) => {
  const sql = 'DELETE FROM destinations WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error deleting destination:', err);
      return res.status(500).json({ error: 'Failed to delete destination' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    res.status(200).json({ message: 'Destination deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
