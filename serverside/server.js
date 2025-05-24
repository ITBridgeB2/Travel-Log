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
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(results[0]);
  });
});

app.delete('/api/destinations/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM destinations WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  });
});

app.get('/api/geocode', async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Address required' });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Google Maps API key in environment' });
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const results = response.data.results;

    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const { lat, lng } = results[0].geometry.location;
    res.json({ lat, lng });
  } catch (error) {
    console.error('Geocoding error:', error.message);
    res.status(500).json({ error: 'Geocoding request failed' });
  }
});
                                                      

app.patch('/api/destinations/:id', (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  const sql = 'UPDATE destinations SET rating = ? WHERE id = ?';
  db.query(sql, [rating, id], (err, result) => {
    if (err) return res.status(500).send('Update failed');
    res.send({ message: 'Rating updated' });
  });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
